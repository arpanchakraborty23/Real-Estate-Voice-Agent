import logging
import asyncio

from dotenv import load_dotenv
from livekit.agents import (
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    cli,
    TurnHandlingOptions,
    room_io,
    UserStateChangedEvent,
    ChatContext
)
from livekit.plugins import ai_coustics, silero

from src.agent import RealEstateEnglishAgent
from src.constants import AgentConfig
from src.service import SessionManager

# Configuration setup
logger = logging.getLogger(AgentConfig.LIVEKIT.LIVEKIT_AGENT_NAME)
session_manager = SessionManager()
load_dotenv(".env.local")

server = AgentServer(
    api_key=AgentConfig.LIVEKIT.LIVEKIT_API_KEY,
    api_secret=AgentConfig.LIVEKIT.LIVEKIT_API_SECRET,
    ws_url=AgentConfig.LIVEKIT.LIVEKIT_URL,
    load_threshold=0.9,
    port=8081,
    host="0.0.0.0"
)



def compute_load(agent_server: AgentServer) -> float:
    return min(len(agent_server.active_jobs) / 10, 1.0)

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

server.setup_fnc = prewarm
server.load_fnc=compute_load


@server.rtc_session()
async def my_agent(ctx: JobContext):

    inactivity_task: asyncio.Task | None = None

    ctx.log_context_fields = {"room": ctx.room.name}
    

    logger.info("Session Starting ...")
    await ctx.connect()

    # Wait for Participent
    participant = await ctx.wait_for_participant()

    # particepent data
    participant_context = {
        "identity": participant.identity,
        "name": participant.name,
        "metadata": participant.metadata,
    }
    logger.info("Participant context: %s", participant_context)

    inital_chat_ctx= ChatContext()
    inital_chat_ctx.add_message(
        role="system",content=f"User intial inforamtion:/n{participant_context}"
    )

    # Initialize session manager with participant context
    session_manager.start(session_id=ctx.room.name, participant_context=participant_context)
    # Agent Session 
    session = AgentSession(
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
        user_away_timeout=12.5, # seconds of silence before "away"
        turn_handling=TurnHandlingOptions(
            turn_detection="stt"
        )
    )

    async def check_if_user_present():
        # Prompt the user a few times, then end the session
        for _ in range(3):
            await session.generate_reply(
                instructions="The user has been inactive. Politely check if the user is still present."
            )
            await asyncio.sleep(10)
        session.shutdown()

    @session.on("user_state_changed")
    def on_user_state_changed(ev: UserStateChangedEvent):
        nonlocal inactivity_task
        if ev.new_state == "away":
            inactivity_task = asyncio.create_task(check_if_user_present())
            return

        # User came back (speaking, listening, etc.) — cancel the check-in
        if inactivity_task is not None:
            inactivity_task.cancel()
            inactivity_task = None


    await session.start(
        agent=RealEstateEnglishAgent(chat_ctx=inital_chat_ctx),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=ai_coustics.audio_enhancement(
                    model=ai_coustics.EnhancerModel.QUAIL_VF_S
                ),
            ),
        ),
    )

    # Event handler for conversation items
    @session.on("conversation_item_added")
    def on_conversation_item(event):
        """Handle conversation items (covers both user and agent messages)."""
        try:
            item = event.item
            if hasattr(item, 'content') and item.content:
                # Determine speaker based on item type or role
                speaker = "USER" if hasattr(item, 'role') and item.role == 'user' else "AGENT"
                
                # Log conversation entry
                log_entry = {
                    "role": speaker.lower(),
                    "message": item.content,
                    "speaker": speaker
                }
                session_manager.session_log(log_entry)
            

        except Exception as e:
            logger.error(f"Error logging conversation item: {e}")

    # Handle session shutdown and cleanup
    async def end_handler():
        """Handle session end and perform cleanup."""
        try:
            
            # End session and persist conversation to MongoDB
            session_manager.end_session()
            
            logger.info(f"Session for room {ctx.room.name} ended and cleaned up.")
        except Exception as e:
            logger.error(f"Error during session cleanup: {e}")

    ctx.add_shutdown_callback(end_handler)
    
if __name__ == "__main__":
    cli.run_app(server)
