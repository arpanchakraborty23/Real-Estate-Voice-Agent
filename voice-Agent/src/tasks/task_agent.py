import json
from dataclasses import dataclass

from livekit.agents import (
    AgentTask,
    ChatContext,
    RunContext,
    function_tool,
    get_job_context,
)
from livekit.agents.llm import ToolError


@dataclass
class UserInfoGatheringResult:
    name: str
    phone: str
    property_interest: str | None = None
    bedroom_count: int | None = None,
    family_members: int | None = None,
    location_preference: str | None = None,
    budget: str | None = None,


@dataclass
class PropertyRecommendation:
    location: str
    price: str
    bedrooms: int
    bathrooms: int
    area_sqft: int
    property_type: str
    builder_name: str
    contact_info: str



class UserContactTask(AgentTask[UserInfoGatheringResult]):
    """Multi-turn task to collect user contact details for a builder inquiry.

    Runs a focused sub-conversation to gather name, phone, and optionally
    email and property interest before returning a typed result.
    """

    def __init__(self, chat_ctx: ChatContext = None) -> None:
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

    @function_tool
    async def collect_requirements_info(
        self,
        name: str,
        phone: str,
        property_interest: str | None = None,
        bedroom_count: int | None = None,
        family_members: int | None = None,
        location_preference: str | None = None,
        budget: str | None = None,

    ) -> None:
        """Call when the user has provided and confirmed their contact details.

        Args:
            name: Full name of the person
            phone: Contact phone number
            email: Optional email address
            property_interest: Optional property they want to know about
            bedroom_count: Optional number of bedrooms they prefer
            family_members: Optional number of family members
            location_preference: Optional location they prefer
            budget: Optional budget range
        """
        return self.complete(
            UserInfoGatheringResult(
                name=name,
                phone=phone,
                property_interest=property_interest,
                bedroom_count=bedroom_count,
                family_members=family_members,
                location_preference=location_preference,
                budget=budget,
            )
        )


class PropertySearchTask(AgentTask[list[PropertyRecommendation]]):
    """Task to search for properties based on user requirements and return recommendations."""

    def __init__(self, chat_ctx: ChatContext = None) -> None:
        super().__init__(
            instructions=(
                "Search for properties that match the user's requirements. "
                "Use the information collected about their preferences, budget, and location. "
                "Return a list of property recommendations with details like location, price, "
                "bedrooms, bathrooms, area, property type, builder name, and contact info."
            ),
            chat_ctx=chat_ctx,
        )

    @function_tool
    async def return_recommendations(
        self,
        property_interest: str | None = None,
        bedroom_count: int | None = None,
        family_members: int | None = None,
        location_preference: str | None = None,
        budget: str | None = None,
        ) -> None:
        """Call when you have the list of property recommendations ready to return."""


    @function_tool
    async def send_to_frontend(
        self,
        context: RunContext,
        recommendations_json: str,
    ) -> str:
        """Send property recommendations to the frontend for display via RPC.

        The frontend must register an RPC method handler called
        'showPropertyRecommendations' to receive and display the data.

        Args:
            recommendations_json: JSON-encoded list of property recommendation objects.
                Each object should have: location, price, bedrooms, bathrooms,
                area_sqft, property_type, builder_name, contact_info
        """
        try:
            json.loads(recommendations_json)
        except json.JSONDecodeError:
            raise ToolError("Invalid JSON in recommendations_json parameter") from None

        job_ctx = get_job_context()
        room = job_ctx.room

        participants = list(room.remote_participants.values())
        if not participants:
            raise ToolError("No frontend participant connected to send recommendations to")

        try:
            response = await room.local_participant.perform_rpc(
                destination_identity=participants[0].identity,
                method="showPropertyRecommendations",
                payload=recommendations_json,
                response_timeout=10.0,
            )
            return response or "Recommendations sent to frontend successfully"
        except Exception as e:
            raise ToolError(f"Failed to send recommendations to frontend: {e}") from e

