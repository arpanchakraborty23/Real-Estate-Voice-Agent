from collections.abc import AsyncIterable

from livekit import rtc
from livekit.agents import Agent, ModelSettings, function_tool, llm, stt

from src.tasks import BuilderContactTask, UserGatheringTask
from src.utils.state import SessionState


class BaseAgent(Agent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.language = "en"

    async def on_enter(self):
        self.session.userdata = SessionState()
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
    ) -> AsyncIterable[llm.ChatChunk]:
        async for chunk in Agent.default.llm_node(
            self,
            chat_ctx=chat_ctx,
            model_settings=model_settings,
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
        result = await UserGatheringTask(
            language=self.language,
            chat_ctx=self.chat_ctx.copy(exclude_instructions=True),
        )
        self.session.userdata.user_name = result.name
        self.session.userdata.user_phone = result.phone
        self.session.userdata.budget = result.budget
        self.session.userdata.preferred_location = result.preferred_location
        self.session.userdata.property_type = result.property_type
        parts = [f"Thank you, {result.name}. I have your requirements."]
        if result.budget:
            parts.append(f"Budget: {result.budget}.")
        if result.preferred_location:
            parts.append(f"Location: {result.preferred_location}.")
        if result.property_type:
            parts.append(f"Property type: {result.property_type}.")
        parts.append("Let me know if you would like to search for matching properties.")
        return " ".join(parts)

    @function_tool
    async def connect_with_builder(self) -> str:
        """Collect contact details to connect the user with a builder or promoter.

        Use this when the user wants to get in touch with a builder,
        promoter, or developer about a property.
        """
        result = await BuilderContactTask(
            chat_ctx=self.chat_ctx.copy(exclude_instructions=True),
        )
        self.session.userdata.user_name = result.name
        self.session.userdata.user_phone = result.phone
        return (
            f"Thank you, {result.name}. Your request to connect with a builder "
            f"has been submitted. A representative will contact you at "
            f"{result.phone}."
        )
