import logging

from livekit.agents import inference
from livekit.plugins import deepgram, cartesia

from .base_agent import BaseAgent
from ..constants import AgentConfig

logger = logging.getLogger(AgentConfig.LIVEKIT.LIVEKIT_AGENT_NAME)


class RealEstateEnglishAgent(BaseAgent):
    def __init__(self, chat_ctx=None) -> None:
        super().__init__(
           instructions="",
           stt=deepgram.STT(
               model=AgentConfig.MODELS.DEEPGRAM_STT_MODEL,api_key=AgentConfig.PROVIDER_API.DEEPGRAM_API_KEY,language="en-IN",mip_opt_out=True
           ),
           llm=inference.LLM(
               model=AgentConfig.MODELS.OPENAI_LLM_MODEL,api_key=AgentConfig.PROVIDER_API.OPENAI_API_KEY,extra_kwargs={
                   "temperature": 0.1, "max_tokens": 500
                   }
           ),
           tts=cartesia.TTS(
               model="sonic-lite",api_key=AgentConfig.PROVIDER_API.CARTESIA_API_KEY,voice=AgentConfig.MODELS.CARTESIA_TTS_VOICE,language="en",text_pacing=True,emotion=['Excited',"Amazed","Apologetic","Confident","Curious","Happy","Surprised"]
           ),
           chat_ctx=chat_ctx,
        )



class RealEstateHindiAgent(BaseAgent):
    def __init__(self, chat_ctx=None) -> None:
        super().__init__(
            instructions="",
            stt=deepgram.STT(
                model=AgentConfig.MODELS.DEEPGRAM_STT_MODEL,api_key=AgentConfig.PROVIDER_API.DEEPGRAM_API_KEY,language="hi-IN",mip_opt_out=True
            ),
            llm=inference.LLM(model=AgentConfig.MODELS.OPENAI_LLM_MODEL,api_key=AgentConfig.PROVIDER_API.OPENAI_API_KEY,extra_kwargs={
                "temperature": 0.1, "max_tokens": 500
            }),
            tts=cartesia.TTS(
                model="sonic-lite",api_key=AgentConfig.PROVIDER_API.CARTESIA_API_KEY,voice=AgentConfig.MODELS.CARTESIA_TTS_VOICE,language="hi",text_pacing=True,emotion=['Excited',"Amazed","Apologetic","Confident","Curious","Happy","Surprised"]
            ),
            chat_ctx=chat_ctx,
        )
