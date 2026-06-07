import logging

from livekit.agents import RunContext, function_tool
from livekit.agents.llm import ToolError

from src.constants import AGENT_NAME

logger = logging.getLogger(f"{AGENT_NAME}.tools")


@function_tool
async def contact_builder(
    context: RunContext,
    name: str,
    phone: str,
    email: str | None = None,
    property_interest: str | None = None,
):
    """Submit a contact request to a builder about a property.

    Use this tool when a user wants to get in touch with a builder or promoter
    for more information about a property. Collect their name, phone number,
    and optionally email and property of interest before calling.

    Args:
        name: Full name of the person making the inquiry
        phone: Contact phone number
        email: Optional email address
        property_interest: Optional name of the property they are interested in
    """
    context.disallow_interruptions()
    logger.info(
        f"Contact request: name='{name}', phone='{phone}', "
        f"email={email}, property={property_interest}"
    )
    try:
        # TODO: integrate with actual CRM or notification system
        pass
    except Exception as e:
        logger.error(f"Failed to submit contact request: {e}")
        raise ToolError(
            "There was an issue submitting your request. Please try again."
        ) from e

    response = f"Thank you, {name}. "
    if property_interest:
        response += f"Your inquiry about {property_interest} has been sent. "
    response += "A builder representative will contact you at the number you provided."
    return response
