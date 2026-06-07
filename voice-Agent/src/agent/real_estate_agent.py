import logging

from livekit.agents import inference

from src.agent import BaseAgent
from src.constants import AGENT_NAME, LLM_MODEL

logger = logging.getLogger(AGENT_NAME)


class RealEstateEnglishAgent(BaseAgent):
    def __init__(self, tts: inference.TTS | None = None, chat_ctx=None) -> None:
        super().__init__(
            llm=inference.LLM(model=LLM_MODEL),
            tts=tts,
            chat_ctx=chat_ctx,
            instructions=(
                "You are a professional real estate assistant for the Indian market. "
                "Communicate in English. Be polite, helpful, and concise.\n\n"
                "Available actions:\n"
                "- collect_property_requirements: Start a guided conversation to understand "
                "the user's property needs (budget, location, property type). "
                "Use when the user wants to find or search for properties.\n"
                "- connect_with_builder: Collect contact details to connect the user "
                "with a builder or promoter.\n\n"
                "Greet the user warmly and ask how you can help with their real estate needs."
            ),
        )


class RealEstateHindiAgent(BaseAgent):
    def __init__(self, tts: inference.TTS | None = None, chat_ctx=None) -> None:
        super().__init__(
            llm=inference.LLM(model=LLM_MODEL),
            tts=tts,
            chat_ctx=chat_ctx,
            instructions=(
                "You are a professional real estate assistant for the Indian market. "
                "Communicate in Hindi. Be polite, helpful, and concise.\n\n"
                "Available actions:\n"
                "- collect_property_requirements: Start a guided conversation to understand "
                "the user's property needs (budget, location, property type). "
                "Use when the user wants to find or search for properties.\n"
                "- connect_with_builder: Collect contact details to connect the user "
                "with a builder or promoter.\n\n"
                "Greet the user warmly and ask how you can help with their real estate needs."
            ),
        )
