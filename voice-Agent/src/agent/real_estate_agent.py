import logging

from livekit.agents.beta.tools import EndCallTool
from livekit.agents import inference
from livekit.plugins import deepgram, cartesia

from .base_agent import BaseAgent
from ..constants import AgentConfig
from ..prompt import ENGLISH_PROMPT, HINDI_PROMPT

logger = logging.getLogger(AgentConfig.LIVEKIT.LIVEKIT_AGENT_NAME)

end_call_tool = EndCallTool(
            extra_description="Only end the call after confirming the customer's issue is resolved.",
            delete_room=True,
            end_instructions="Thank the customer for their time and wish them a good day.",
        )


class RealEstateEnglishAgent(BaseAgent):
    def __init__(self, chat_ctx=None) -> None:
        super().__init__(
           instructions=ENGLISH_PROMPT,
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
           tools=[end_call_tool.tools]
        )



class RealEstateHindiAgent(BaseAgent):
    def __init__(self, chat_ctx=None) -> None:
        super().__init__(
            instructions=HINDI_PROMPT,
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
            tools=[end_call_tool.tools]
        )
