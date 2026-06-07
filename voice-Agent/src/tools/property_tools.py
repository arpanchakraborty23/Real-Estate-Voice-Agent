import logging

from livekit.agents import RunContext, function_tool
from livekit.agents.llm import ToolError

from src.constants import AGENT_NAME
from src.utils.vector_store import vector_store

logger = logging.getLogger(f"{AGENT_NAME}.tools")


@function_tool
async def search_properties(context: RunContext, query: str, budget: str | None = None):
    """Search for properties matching the user's requirements.

    Use this tool when a user asks about available properties, wants to find
    a home, apartment, plot, or commercial space.

    Args:
        query: What the user is looking for (e.g. "2 BHK apartment in Bangalore", "budget-friendly flat near HSR Layout")
        budget: Optional budget constraint (e.g. "under 1 crore", "50 lakhs to 80 lakhs")
    """
    logger.info(f"Searching properties: query='{query}', budget={budget}")
    try:
        results = await vector_store.search_properties(query)
    except Exception as e:
        logger.error(f"Vector store search failed: {e}")
        raise ToolError(
            "I encountered an error while searching. Please try again."
        ) from e

    if not results:
        return "I could not find any properties matching your description at this time."

    summary = f"I found {len(results)} properties that match your requirements. "
    for i, prop in enumerate(results[:3], 1):
        summary += f"{i}. {prop.get('name', 'Property')} - {prop.get('builder', '')} - {prop.get('price', 'Price on request')}. "
    if len(results) > 3:
        summary += f"There are {len(results) - 3} more options available."
    return summary


@function_tool
async def get_property_details(context: RunContext, property_name: str):
    """Get detailed information about a specific property.

    Args:
        property_name: Name or identifier of the property
    """
    logger.info(f"Fetching details for: '{property_name}'")
    try:
        results = await vector_store.search_properties(property_name, top_k=1)
    except Exception as e:
        logger.error(f"Vector store lookup failed: {e}")
        raise ToolError(
            "I could not retrieve property details right now. Please try again."
        ) from e

    if not results:
        return f"I could not find details for '{property_name}'. Please check the name and try again."

    prop = results[0]
    details = (
        f"{prop.get('name', 'Property')} by {prop.get('builder', 'Builder')}. "
        f"Located at {prop.get('location', 'Location on request')}. "
        f"Price: {prop.get('price', 'Contact for pricing')}. "
    )
    if prop.get("amenities"):
        details += f"Amenities include: {prop.get('amenities')}. "
    if prop.get("status"):
        details += f"Status: {prop.get('status')}."
    return details


@function_tool
async def compare_properties(context: RunContext, property_a: str, property_b: str):
    """Compare two properties side by side.

    Args:
        property_a: Name of the first property
        property_b: Name of the second property
    """
    logger.info(f"Comparing: '{property_a}' vs '{property_b}'")
    try:
        results = await vector_store.search_properties(
            f"{property_a} {property_b}", top_k=2
        )
    except Exception as e:
        logger.error(f"Vector store comparison failed: {e}")
        raise ToolError(
            "I could not compare these properties right now. Please try again."
        ) from e

    if len(results) < 2:
        return "I could not find enough information to compare these properties."

    comparison = f"Comparing {results[0].get('name', 'Property A')} and {results[1].get('name', 'Property B')}: "
    for key in ["price", "location", "size", "status"]:
        val_a = results[0].get(key, "N/A")
        val_b = results[1].get(key, "N/A")
        if val_a != "N/A" or val_b != "N/A":
            comparison += f"{key.capitalize()}: {val_a} vs {val_b}. "
    return comparison
