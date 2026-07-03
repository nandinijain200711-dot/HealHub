from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection
from app.core.config import settings

# MongoDB connection
client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None

async def connect_to_mongo():
    """Connect to MongoDB"""
    global client, database

    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client[settings.DATABASE_NAME]

    try:
        await client.admin.command("ping")
        print("✅ Connected to MongoDB successfully")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    global client

    if client:
        client.close()
        print("✅ Disconnected from MongoDB")

def get_database() -> AsyncIOMotorDatabase | None:
    """Get database instance"""
    return database

def get_collection(collection_name: str) -> AsyncIOMotorCollection:
    """Get a specific collection"""
    if database is None:
        raise RuntimeError("Database not initialized")
    return database[collection_name]