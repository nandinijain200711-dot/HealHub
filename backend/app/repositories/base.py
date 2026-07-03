from motor.motor_asyncio import AsyncIOMotorCollection
from bson.objectid import ObjectId
from typing import List, Optional, Dict, Any
from datetime import datetime


class BaseRepository:
    """Base repository for common database operations"""
    
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection
    
    async def create(self, data: dict) -> str:
        """Create a document"""
        result = await self.collection.insert_one(data)
        return str(result.inserted_id)
    
    async def get_by_id(self, id: str) -> Optional[dict]:
        """Get document by ID"""
        try:
            return await self.collection.find_one({"_id": ObjectId(id)})
        except:
            return None
    
    async def update(self, id: str, data: dict) -> bool:
        """Update document"""
        try:
            data["updated_at"] = datetime.utcnow()
            result = await self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": data}
            )
            return result.modified_count > 0
        except:
            return False
    
    async def delete(self, id: str) -> bool:
        """Delete document"""
        try:
            result = await self.collection.delete_one({"_id": ObjectId(id)})
            return result.deleted_count > 0
        except:
            return False
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all documents with pagination"""
        cursor = self.collection.find().skip(skip).limit(limit)
        return await cursor.to_list(length=limit)
    
    async def count(self) -> int:
        """Count total documents"""
        return await self.collection.count_documents({})
    
    async def exists(self, query: dict) -> bool:
        """Check if document exists"""
        return await self.collection.find_one(query) is not None


class UserRepository(BaseRepository):
    """User repository"""
    
    async def get_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        return await self.collection.find_one({"email": email.lower()})
    
    async def create_user(self, data: dict) -> str:
        """Create new user"""
        data["email"] = data["email"].lower()
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        return await self.create(data)
    
    async def get_user_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        return await self.get_by_email(email)


class AdminRepository(BaseRepository):
    """Admin repository"""
    
    async def get_by_username(self, username: str) -> Optional[dict]:
        """Get admin by username"""
        return await self.collection.find_one({"username": username})
    
    async def get_by_email(self, email: str) -> Optional[dict]:
        """Get admin by email"""
        return await self.collection.find_one({"email": email.lower()})
    
    async def create_admin(self, data: dict) -> str:
        """Create new admin"""
        data["email"] = data["email"].lower()
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        data["is_active"] = True
        return await self.create(data)


class ChatSessionRepository(BaseRepository):
    """Chat session repository"""
    
    async def create_session(self, user_email: str, data: dict) -> str:
        """Create new chat session"""
        data["user_email"] = user_email.lower()
        data["messages"] = []
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        return await self.create(data)
    
    async def add_message(self, session_id: str, message: dict) -> bool:
        """Add message to chat session"""
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(session_id)},
                {
                    "$push": {"messages": message},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            return result.modified_count > 0
        except:
            return False
    
    async def update_insights(self, session_id: str, insights: str) -> bool:
        """Update AI insights for session"""
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(session_id)},
                {
                    "$set": {
                        "ai_insights": insights,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False
    
    async def get_user_sessions(self, user_email: str) -> List[dict]:
        """Get all sessions for a user"""
        cursor = self.collection.find({"user_email": user_email.lower()}).sort("created_at", -1)
        return await cursor.to_list(length=100)


class AppointmentRepository(BaseRepository):
    """Appointment repository"""
    
    async def create_appointment(self, data: dict) -> str:
        """Create new appointment"""
        data["user_email"] = data["user_email"].lower()
        data["status"] = "pending"
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        data["meet_link"] = data.get("meet_link", "")
        return await self.create(data)
    
    async def get_user_appointments(self, user_email: str) -> List[dict]:
        """Get appointments for a user"""
        cursor = self.collection.find({"user_email": user_email.lower()}).sort("appointment_date", -1)
        return await cursor.to_list(length=100)
    
    async def get_appointments_by_status(self, status: str) -> List[dict]:
        """Get appointments by status"""
        cursor = self.collection.find({"status": status}).sort("appointment_date", 1)
        return await cursor.to_list(length=100)
    
    async def update_status(self, appointment_id: str, status: str, notes: Optional[str] = None) -> bool:
        """Update appointment status"""
        update_data = {
            "status": status,
            "updated_at": datetime.utcnow()
        }
        if notes:
            update_data["notes"] = notes
        
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(appointment_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except:
            return False


class FAQRepository(BaseRepository):
    """FAQ repository"""
    
    async def get_by_category(self, category: str) -> List[dict]:
        """Get FAQs by category"""
        cursor = self.collection.find({"category": category}).sort("order", 1)
        return await cursor.to_list(length=100)
    
    async def get_all_sorted(self) -> List[dict]:
        """Get all FAQs sorted by category and order"""
        cursor = self.collection.find().sort([("category", 1), ("order", 1)])
        return await cursor.to_list(length=500)
    
    async def create_faq(self, data: dict) -> str:
        """Create new FAQ"""
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        return await self.create(data)


class DoctorRepository(BaseRepository):
    """Doctor repository"""
    
    async def get_by_specialization(self, specialization: str) -> List[dict]:
        """Get doctors by specialization"""
        cursor = self.collection.find({"specialization": specialization})
        return await cursor.to_list(length=100)
    
    async def create_doctor(self, data: dict) -> str:
        """Create new doctor"""
        data["email"] = data["email"].lower()
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        return await self.create(data)


class ContactRepository(BaseRepository):
    """Contact information repository"""
    
    async def get_contact_info(self) -> Optional[dict]:
        """Get main contact information"""
        return await self.collection.find_one({})
    
    async def update_contact_info(self, data: dict) -> bool:
        """Update contact information"""
        doc = await self.get_contact_info()
        if doc:
            return await self.update(str(doc["_id"]), data)
        else:
            data["created_at"] = datetime.utcnow()
            data["updated_at"] = datetime.utcnow()
            await self.create(data)
            return True


class WebsiteContentRepository(BaseRepository):
    """Website content repository"""
    
    async def get_content(self) -> Optional[dict]:
        """Get website content"""
        return await self.collection.find_one({})
    
    async def update_content(self, data: dict) -> bool:
        """Update website content"""
        doc = await self.get_content()
        if doc:
            return await self.update(str(doc["_id"]), data)
        else:
            data["updated_at"] = datetime.utcnow()
            await self.create(data)
            return True
