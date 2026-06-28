import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv

from ..constants.config import AgentConfig, SessionState
from .db_service import MongoServices, RedisServices


# Load session TTL from config (default: 2 hours)
SESSION_TTL = AgentConfig.REDIS.REDIS_SESSION_TTL


class SessionManager:
    """Session Conversation Manager using Redis for active session storage and MongoDB for persistence."""

    def __init__(self):
        self.mongo_services = MongoServices(
            url=AgentConfig.MONGODB.MONGODB_URI,
            db=AgentConfig.MONGODB.MONGODB_DB_NAME,
            collection=AgentConfig.MONGODB.MONGODB_COLLECTION_NAME
        )
        self.collection = None
        self.session_id = None
        self.logger = logging.getLogger(__name__)
        self._mongo_initialized = False
        self._redis = RedisServices(
            host=AgentConfig.REDIS.REDIS_HOST,
            port=AgentConfig.REDIS.REDIS_PORT,
            password=AgentConfig.REDIS.REDIS_PASSWORD,
            db=AgentConfig.REDIS.REDIS_DB
        )

    def _ensure_mongo_connected(self) -> None:
        if not self._mongo_initialized:
            try:
                self.collection = self.mongo_services.connect()
                self._mongo_initialized = True
            except Exception as e:
                self.logger.error(f"Failed to connect to MongoDB: {e}")
                self.logger.warning("Continuing without MongoDB - session data will not be persisted")

    def _redis_key(self, session_id: str) -> str:
        return f"session:{session_id}"

    def start(self, session_id: str, participant_context: dict) -> None:
        try:
            self.session_id = session_id

            self._ensure_mongo_connected()

            # Calculate expiration time
            expires_at = datetime.now() + timedelta(seconds=SESSION_TTL)
            
            if self._mongo_initialized and self.collection is not None:
                session_info = {
                    "session_id": session_id,
                    "participant_context": participant_context,
                    "created_at": datetime.now().isoformat(),
                    "expires_at": expires_at.isoformat(),
                    "session_ended": False,
                }
                self.collection.insert_one(session_info)
                self.logger.info(f"Session {session_id} info stored in MongoDB.")
            else:
                self.logger.warning(f"MongoDB not available - session {session_id} metadata not persisted")

            redis_data = {
                "session_id": session_id,
                "conversation_history": [],
                "expires_at": expires_at.isoformat(),
            }
            self._redis.set_json(self._redis_key(session_id), redis_data)
            self.logger.info(f"Session {session_id} initialized in Redis with {SESSION_TTL}s TTL (expires at {expires_at.isoformat()}).")

        except Exception as e:
            self.logger.error(f"Failed to start session {session_id}: {e}")
            raise

    def session_log(self, log_entry: dict) -> None:
        if not self.session_id:
            self.logger.error("No active session. Call start() first.")
            return

        try:
            if "timestamp" not in log_entry:
                log_entry["timestamp"] = datetime.now().isoformat()

            self._redis.append_to_array(
                self._redis_key(self.session_id),
                "conversation_history",
                log_entry,
                ttl=SESSION_TTL
            )
            self.logger.info(f"Logged conversation entry for session {self.session_id}.")

        except Exception as e:
            self.logger.error(f"Failed to log conversation for session {self.session_id}: {e}")
            raise

    def get_session_logs(self) -> list:
        if not self.session_id:
            self.logger.error("No active session. Call start() first.")
            return []

        try:
            data = self._redis.get_json(self._redis_key(self.session_id))
            if data is None:
                self.logger.error(f"Session {self.session_id} not found in Redis.")
                return []
            return data.get("conversation_history", [])
        except Exception as e:
            self.logger.error(f"Failed to read session logs from Redis: {e}")
            return []

    def end_session(self) -> None:
        if not self.session_id:
            self.logger.warning("No active session to end.")
            return

        redis_key = self._redis_key(self.session_id)

        try:
            conversation_history = []
            session_data = self._redis.get_json(redis_key)
            if session_data is not None:
                conversation_history = session_data.get("conversation_history", [])

            if self._mongo_initialized and self.collection is not None:
                self.collection.update_one(
                    {"session_id": self.session_id},
                    {
                        "$set": {
                            "conversation_history": conversation_history,
                            "session_ended": True,
                            "ended_at": datetime.now().isoformat()
                        }
                    }
                )
                self.logger.info(
                    f"Session {self.session_id} ended. "
                    f"Stored {len(conversation_history)} messages."
                )
            else:
                self.logger.warning(
                    f"Session {self.session_id} ended but not persisted to MongoDB. "
                    f"Conversation logs ({len(conversation_history)} messages) are available in Redis only."
                )

            self._redis.delete(redis_key)
            self.logger.info(f"Redis key {redis_key} deleted.")

        except Exception as e:
            self.logger.error(f"Failed to end session {self.session_id}: {e}")
            raise

    def is_session_expired(self) -> bool:
        """Check if the current session has expired in Redis."""
        if not self.session_id:
            return True
        
        try:
            data = self._redis.get_json(self._redis_key(self.session_id))
            if data is None:
                return True
            
            expires_at = data.get("expires_at")
            if expires_at:
                expiry_time = datetime.fromisoformat(expires_at)
                return datetime.now() > expiry_time
            
            return True
        except Exception as e:
            self.logger.error(f"Failed to check session expiry: {e}")
            return True

    def refresh_session_ttl(self) -> bool:
        """Refresh the session TTL in Redis (extend session)."""
        if not self.session_id:
            self.logger.error("No active session to refresh.")
            return False
        
        try:
            redis_key = self._redis_key(self.session_id)
            data = self._redis.get_json(redis_key)
            
            if data is None:
                self.logger.warning(f"Session {self.session_id} not found in Redis.")
                return False
            
            # Update expiration time
            expires_at = datetime.now() + timedelta(seconds=SESSION_TTL)
            data["expires_at"] = expires_at.isoformat()
            
            self._redis.set_json(redis_key, data, ttl=SESSION_TTL)
            self.logger.info(f"Session {self.session_id} TTL refreshed. New expiry: {expires_at.isoformat()}")
            return True
        
        except Exception as e:
            self.logger.error(f"Failed to refresh session TTL: {e}")
            return False

    def get_session_info(self) -> dict:
        """Get session info including expiration time."""
        if not self.session_id:
            return {}
        
        try:
            data = self._redis.get_json(self._redis_key(self.session_id))
            if data is None:
                return {}
            
            return {
                "session_id": data.get("session_id"),
                "expires_at": data.get("expires_at"),
                "conversation_count": len(data.get("conversation_history", []))
            }
        except Exception as e:
            self.logger.error(f"Failed to get session info: {e}")
            return {}