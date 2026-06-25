import sys
import logging
from dotenv import load_dotenv
from pymongo import MongoClient, errors
from redis import Redis


# Configure logging
logger = logging.getLogger(__name__)
load_dotenv()

class MongoDBValidation:
    """Single Class Validate MongoDB Credentials"""

    @staticmethod
    def mongo_credentials(url: str, db: str, collection: str):
        """
        Validate MongoDB connection, database, and collection.

        Args:
            url (str): MongoDB connection string
            db (str): Database name
            collection (str): Collection name

        Returns:
            tuple: (MongoClient, collection_name)
        """
        client = None
        try:
            client = MongoClient(url, serverSelectionTimeoutMS=5000)
            client.admin.command("ping")  # Test connection

            database = client[db]
            if collection not in database.list_collection_names():
                logger.warning(
                    f"✅ Connected to MongoDB, but collection '{collection}' not found in '{db}'."
                )
            else:
                logger.info(f"✅ MongoDB credentials valid. Connected to '{db}.{collection}'.")

            return client, database[collection]

        except errors.OperationFailure as e:
            logger.error(f"❌ MongoDB Authentication failed: {e}")
            raise
        except Exception as e:
            logger.error(f"❌ MongoDB Connection error: {e}")
            raise



class RedisValidation:
    """Validate Redis Connection"""

    @staticmethod
    def get_redis(host: str, port: int, password: str = None, db: int = 0):
        """
        Validate Redis connection.

        Args:
            host (str): Redis host address
            port (int): Redis port number
            password (str, optional): Redis password for authentication
            db (int, optional): Redis database number (default: 0)

        Returns:
            Redis: Redis client instance
        """
        client = None
        try:
            client = Redis(
                host=host,
                port=port,
                password=password,
                db=db,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
            )
            client.ping()  # Test connection
            logger.info(f"✅ Redis credentials valid. Connected to {host}:{port}/{db}.")
            return client

        except Exception as e:
            logger.error(f"❌ Redis Connection error: {e}")
            raise


class RedisServices:
    """Responsibility: Manage Redis Connection"""

    def __init__(self, host: str, port: int, password: str = None, db: int = 0):
        self.host = host
        self.port = port
        self.password = password
        self.db = db
        self.client = None

    def connect(self):
        self.client = RedisValidation.get_redis(
            host=self.host,
            port=self.port,
            password=self.password,
            db=self.db,
        )
        return self.client

    def set(self, key: str, value: str, ex: int = None):
        """Set a key-value pair in Redis."""
        if self.client is None:
            self.connect()
        return self.client.set(key, value, ex=ex)

    def get(self, key: str):
        """Get value by key from Redis."""
        if self.client is None:
            self.connect()
        return self.client.get(key)

    def delete(self, key: str):
        """Delete a key from Redis."""
        if self.client is None:
            self.connect()
        return self.client.delete(key)

    def exists(self, key: str):
        """Check if a key exists in Redis."""
        if self.client is None:
            self.connect()
        return self.client.exists(key)

    def set_json(self, key: str, value: dict, ex: int = None):
        """Set a JSON value in Redis."""
        import json
        if self.client is None:
            self.connect()
        return self.client.set(key, json.dumps(value), ex=ex)

    def get_json(self, key: str):
        """Get JSON value by key from Redis."""
        import json
        if self.client is None:
            self.connect()
        data = self.client.get(key)
        if data is None:
            return None
        return json.loads(data)

    def append_to_array(self, key: str, array_field: str, value: dict, ttl: int = None):
        """Append value to an array field in a JSON object."""
        import json
        if self.client is None:
            self.connect()
        
        data = self.get_json(key)
        if data is None:
            data = {}
        
        if array_field not in data:
            data[array_field] = []
        
        data[array_field].append(value)
        self.set_json(key, data, ex=ttl)

    def delete(self, key: str):
        """Delete a key from Redis."""
        if self.client is None:
            self.connect()
        return self.client.delete(key)

    def disconnect(self):
        if self.client:
            self.client.close()
            self.client = None
            logger.info("🧹 Redis connection closed.")


class MongoServices:
    """Responsibility: Manage MongoDB Connection"""

    def __init__(self, url: str, db: str, collection: str):
        self.url = url
        self.db = db
        self.collection_name = collection
        self.client = None
        self.collection = None

    def connect(self):
        self.client, self.collection = MongoDBValidation.mongo_credentials(
            url=self.url, db=self.db, collection=self.collection_name
        )
        return self.collection

    def insert_one(self, document: dict):
        if self.collection is None:
            self.connect()
        assert self.collection is not None
        return self.collection.insert_one(document)

    def disconnect(self):
        if self.client:
            self.client.close()
            self.client = None
            self.collection = None
            logger.info("🧹 MongoDB connection closed.")