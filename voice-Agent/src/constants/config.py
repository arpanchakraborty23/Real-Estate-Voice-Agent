import os
from dotenv import load_dotenv
from dataclasses import dataclass


load_dotenv()

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


@dataclass
class AgentConfig:
    LIVEKIT: type[LivekitConfig] = LivekitConfig
    AWS: type[AWSConfig] = AWSConfig
    PROVIDER_API: type[ProviderAPIConfig] = ProviderAPIConfig
    MODELS: type[ModelsConfig] = ModelsConfig
    AWS: type[AWSConfig] = AWSConfig
    PROVIDER_API: type[ProviderAPIConfig] = ProviderAPIConfig