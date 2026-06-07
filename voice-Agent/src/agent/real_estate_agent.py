import logging

from livekit.agents import Agent, RunContext, function_tool, inference

from src.constants import AGENT_NAME
from src.prompt import REAL_ESTATE_SUPERVISOR_PROMPT
from src.tasks import BuilderContactTask
from src.tools import (
    compare_properties,
    contact_builder,
    get_property_details,
    search_properties,
)

logger = logging.getLogger(AGENT_NAME)


class RealEstateAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            llm=inference.LLM(model="openai/gpt-5.2-chat-latest"),
            instructions=REAL_ESTATE_SUPERVISOR_PROMPT,
            tools=[
                search_properties,
                get_property_details,
                compare_properties,
                contact_builder,
                self.collect_contact_for_builder,
            ],
        )

    @function_tool
    async def collect_contact_for_builder(self, context: RunContext) -> str:
        """Use when the user wants a builder to contact them but hasn't provided complete details yet.

        Launches a focused conversation to collect the user's name, phone number,
        and optionally their email and property of interest. Returns the collected
        information so you can confirm with the user before submitting.
        """
        result = await BuilderContactTask(
            chat_ctx=self.chat_ctx.copy(exclude_instructions=True)
        )
        msg_parts = []
        if result.name:
            msg_parts.append(f"name: {result.name}")
        if result.phone:
            msg_parts.append(f"phone: {result.phone}")
        if result.email:
            msg_parts.append(f"email: {result.email}")
        if result.property_interest:
            msg_parts.append(f"interested in: {result.property_interest}")
        collected = ", ".join(msg_parts)
        logger.info(f"Builder contact collected: {collected}")
        return (
            f"I've collected your contact details: {collected}. "
            "Would you like me to submit this to the builder, or change anything?"
        )
