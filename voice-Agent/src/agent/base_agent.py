from collections.abc import AsyncIterable

from livekit import rtc
from livekit.agents import Agent, ModelSettings, function_tool, llm, stt

from ..tasks import UserContactTask



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

