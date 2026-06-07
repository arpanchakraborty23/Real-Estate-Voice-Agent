from dataclasses import dataclass, field


@dataclass
class SessionState:
    phase: str = "greeting"
    language: str | None = None
    user_name: str | None = None
    user_phone: str | None = None
    budget: str | None = None
    preferred_location: str | None = None
    property_type: str | None = None
    recommended_properties: list[str] = field(default_factory=list)
    saved: bool = False
