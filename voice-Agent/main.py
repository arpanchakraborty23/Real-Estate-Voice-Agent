import logging

from dotenv import load_dotenv
from livekit.agents import (
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    cli,
    TurnHandlingOptions,
    room_io,
)
from livekit.plugins import ai_coustics, silero

from src.agent import RealEstateEnglishAgent
from src.constants import AgentConfig

logger = logging.getLogger(AgentConfig.LIVEKIT.LIVEKIT_AGENT_NAME)

load_dotenv(".env.local")

server = AgentServer()


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


server.setup_fnc = prewarm


@server.rtc_session()
async def my_agent(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}

    session = AgentSession(
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
        turn_handling=TurnHandlingOptions(
            turn_detection="stt"
        )
    )

    await session.start(
        agent=RealEstateEnglishAgent(),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=ai_coustics.audio_enhancement(
                    model=ai_coustics.EnhancerModel.QUAIL_VF_S
                ),
            ),
        ),
    )

    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(server)
