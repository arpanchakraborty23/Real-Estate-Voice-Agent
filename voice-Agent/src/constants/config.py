import os
from dotenv import load_dotenv
from dataclasses import dataclass, field
from typing import Optional


load_dotenv()


# =======================
# Database Configs
# =======================

class MongoDBConfig:
    MONGODB_URI = os.getenv("MONGODB_URI")
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "real_estate_agent")
    MONGODB_COLLECTION_NAME = os.getenv("MONGODB_COLLECTION_NAME", "sessions")


class RedisConfig:
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")
    REDIS_DB = int(os.getenv("REDIS_DB", 0))
    REDIS_SESSION_TTL = int(os.getenv("REDIS_SESSION_TTL", 7200))  # 2 hours in seconds


# =======================
# Service Configs
# =======================

class LivekitConfig:
    LIVEKIT_URL = os.getenv("LIVEKIT_URL")
    LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
    LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
    LIVEKIT_AGENT_NAME = os.getenv("LIVEKIT_AGENT_NAME", "Voice Agent")


class AWSConfig:
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION_NAME = os.getenv("AWS_REGION_NAME", "us-east-1")
    AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")


class ProviderAPIConfig:
    DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
    CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")


class ModelsConfig:
    DEEPGRAM_STT_MODEL = os.getenv("STT_MODEL", "deepgram/nova-3")
    CARTESIA_TTS_MODEL = os.getenv("TTS_MODEL", "cartesia/sonic-3")
    CARTESIA_TTS_VOICE = os.getenv("TTS_VOICE", "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc")
    OPENAI_LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-5.2-chat-latest")


class SiptrankConfig:
    SIP_TRUNK_HOSTNAME = os.getenv("SIP_TRUNK_HOSTNAME")
    SIP_AUTH_USERNAME = os.getenv("SIP_AUTH_USERNAME")
    SIP_AUTH_PASSWORD = os.getenv("SIP_AUTH_PASSWORD")
    SUPPORT_AGENT_PHONE_NUMBER = os.getenv("SUPPORT_AGENT_PHONE_NUMBER")


# =======================
# Agent Config
# =======================

@dataclass
class AgentConfig:
    MONGODB: type[MongoDBConfig] = MongoDBConfig
    REDIS: type[RedisConfig] = RedisConfig
    LIVEKIT: type[LivekitConfig] = LivekitConfig
    AWS: type[AWSConfig] = AWSConfig
    PROVIDER_API: type[ProviderAPIConfig] = ProviderAPIConfig
    MODELS: type[ModelsConfig] = ModelsConfig
    SIP: type[SiptrankConfig] = SiptrankConfig


# =======================
# Session State
# =======================

@dataclass
class SessionState:
    phase: str = "greeting"
    language: Optional[str] = None
    user_name: Optional[str] = None
    user_phone: Optional[str] = None
    budget: Optional[str] = None
    preferred_location: Optional[str] = None
    property_type: Optional[str] = None
    recommended_properties: list = field(default_factory=list)
    saved: bool = False
    session_expires_at: Optional[str] = None