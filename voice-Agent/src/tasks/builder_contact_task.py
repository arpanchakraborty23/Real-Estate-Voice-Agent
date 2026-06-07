from dataclasses import dataclass

from livekit.agents import AgentTask, function_tool


@dataclass
class BuilderContactResult:
    name: str
    phone: str
    email: str | None = None
    property_interest: str | None = None


class BuilderContactTask(AgentTask[BuilderContactResult]):
    """Multi-turn task to collect user contact details for a builder inquiry.

    Runs a focused sub-conversation to gather name, phone, and optionally
    email and property interest before returning a typed result.
    """

    def __init__(self, chat_ctx=None) -> None:
        super().__init__(
            instructions=(
                "Collect the user's contact information to share with a builder. "
                "Ask for their name and phone number first. Then optionally ask "
                "for their email and which property they are interested in. "
                "Read back all details and ask for confirmation before completing. "
                "Be polite and professional."
            ),
            chat_ctx=chat_ctx,
        )

    async def on_enter(self) -> None:
        await self.session.generate_reply(
            instructions=(
                "Ask the user for their name and phone number so we can "
                "connect them with a builder."
            )
        )

    @function_tool
    async def contact_info_collected(
        self,
        name: str,
        phone: str,
        email: str | None = None,
        property_interest: str | None = None,
    ) -> None:
        """Call when the user has provided and confirmed their contact details.

        Args:
            name: Full name of the person
            phone: Contact phone number
            email: Optional email address
            property_interest: Optional property they want to know about
        """
        self.complete(
            BuilderContactResult(
                name=name,
                phone=phone,
                email=email,
                property_interest=property_interest,
            )
        )
