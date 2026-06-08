from dataclasses import dataclass

from livekit.agents import AgentTask, function_tool, ChatContext


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
        