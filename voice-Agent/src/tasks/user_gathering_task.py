from dataclasses import dataclass

from livekit.agents import AgentTask, function_tool


@dataclass
class UserGatheringResult:
    name: str
    phone: str
    budget: str | None = None
    preferred_location: str | None = None
    property_type: str | None = None


class UserGatheringTask(AgentTask[UserGatheringResult]):
    """Multi-turn task to collect user details for property recommendations.

    Runs a focused sub-conversation to gather: name, phone,
    budget, preferred location, and property type.
    """

    def __init__(self, language: str | None = None, chat_ctx=None) -> None:
        lang_hint = ""
        if language:
            lang_hint = f" Communicate in {language}."
        super().__init__(
            instructions=(
                "Collect the user's details for property recommendations."
                f"{lang_hint}"
                " Ask one thing at a time: first their name, then phone number,"
                " then budget range, then preferred location or city,"
                " then property type (apartment, villa, plot, or commercial)."
                " Do NOT ask for language preference - we already know it."
                " Read back all details and ask for confirmation before completing."
                " Be polite and professional."
            ),
            chat_ctx=chat_ctx,
        )

    async def on_enter(self) -> None:
        await self.session.generate_reply(
            instructions="Ask the user for their name to get started."
        )

    @function_tool
    async def user_details_collected(
        self,
        name: str,
        phone: str,
        budget: str | None = None,
        preferred_location: str | None = None,
        property_type: str | None = None,
    ) -> None:
        """Call when the user has provided and confirmed all their details.

        Args:
            name: Full name of the user
            phone: Contact phone number
            budget: Budget range (e.g. under 1 crore, 50-80 lakhs)
            preferred_location: City or area they are looking in
            property_type: Type of property (apartment, villa, plot, commercial)
        """
        self.complete(
            UserGatheringResult(
                name=name,
                phone=phone,
                budget=budget,
                preferred_location=preferred_location,
                property_type=property_type,
            )
        )
