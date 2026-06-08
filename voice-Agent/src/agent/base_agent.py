from collections.abc import AsyncIterable

from livekit import rtc
from livekit.agents import Agent, ModelSettings, function_tool, llm, stt
from livekit.agents.beta.workflows import WarmTransferTask
from livekit.protocol.sip import SIPOutboundConfig

from ..tasks import UserContactTask
from ..constants import AgentConfig



class BaseAgent(Agent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.language = "en"

    async def on_enter(self):
        await self.session.generate_reply(
            instructions="Greet the user warmly. Ask which language they prefer: English or Hindi."
        )

    async def stt_node(
        self, audio: AsyncIterable[rtc.AudioFrame], model_settings: ModelSettings
    ) -> AsyncIterable[stt.SpeechEvent | str]:
        async def filtered_audio():
            async for frame in audio:
                yield frame

        async for event in Agent.default.stt_node(
            self, filtered_audio(), model_settings
        ):
            if event.alternatives:
                detected_lang = event.alternatives[0].language or self.language
                self.language = detected_lang
                if self.session and self.session.userdata:
                    self.session.userdata.language = detected_lang
            yield event

    async def llm_node(
        self,
        chat_ctx: llm.ChatContext,
        model_settings: ModelSettings,
        tools: list[llm.Tool]
    ) -> AsyncIterable[llm.ChatChunk]:
        async for chunk in Agent.default.llm_node(
            self,
            chat_ctx=chat_ctx,
            model_settings=model_settings,
            tools=tools,
        ):
            yield chunk

    async def tts_node(
        self, text: AsyncIterable[str], model_settings: ModelSettings
    ) -> AsyncIterable[rtc.AudioFrame]:
        async for frame in Agent.default.tts_node(self, text, model_settings):
            yield frame

    @function_tool
    async def collect_property_requirements(self) -> str:
        """Start a guided conversation to understand the user's property needs.

        Use this when the user wants to find or search for properties,
        apartments, villas, plots, or commercial spaces.
        """
        result = await UserContactTask(
            chat_ctx=self.chat_ctx.copy(exclude_instructions=True),
        )

        self.session.say(f"Thank you, {result.name}. I have your requirements.")

        self.chat_ctx.add_message(
            role="assistant",
            content=f"Collected property requirements: {result}",
        )

        return f"User Data Collection Completed !"

    @function_tool
    async def property_recommendation(
        self,        
        property_interest: str | None = None,
        bedroom_count: int | None = None,
        family_members: int | None = None,
        location_preference: str | None = None,
        budget: str | None = None
    ) -> list[dict]:
        """Search for properties based on user requirements and return recommendations."""
        # This is a placeholder implementation. In a real application, this would query a database or API.
        recommendations = [
            {
                "location": "Andheri West, Mumbai",
                "price": "₹1.5 Crore",
                "bedrooms": 2,
                "bathrooms": 2,
                "area": "1200 sqft",
                "property_type": "Apartment",
                "builder_name": "ABC Builders",
                "contact_info": "+91-9876543210"
            },
            {
                "location": "Bandra East, Mumbai",
                "price": "₹3 Crore",
                "bedrooms": 3,
                "bathrooms": 3,
                "area": "2000 sqft",
                "property_type": "Apartment",
                "builder_name": "XYZ Constructions",
                "contact_info": "+91-9123456780"
            }
        ]
        return recommendations

    @function_tool
    async def warm_transfer_to_agent(self):
        """Warm transfer the user to a human agent for further assistance."""
        if not AgentConfig.SIP.SUPPORT_AGENT_PHONE_NUMBER:
            return "Support agent phone number not configured. Please try again later."

        result = await WarmTransferTask(
            sip_call_to=AgentConfig.SIP.SUPPORT_AGENT_PHONE_NUMBER,
            sip_connection=SIPOutboundConfig(
                hostname=AgentConfig.SIP.SIP_TRUNK_HOSTNAME,
                auth_username=AgentConfig.SIP.SIP_AUTH_USERNAME,
                auth_password=AgentConfig.SIP.SIP_AUTH_PASSWORD,
            ),
            chat_ctx=self.chat_ctx,               # Conversation history
            dtmf="wwww1234#",                     # Dial extension 1234 after ~2s pause
            ringing_timeout=30.0,                 # Give up after 30s if no answer
            instructions="Warm transfer the user to a human agent. Provide the agent with the conversation history and context about the user's needs. Ensure a smooth handoff and inform the user about the transfer."

        )