from app.repositories.base import ChatSessionRepository
from app.utils.openai_helper import get_ai_health_insights, generate_health_summary
from app.schemas.schemas import ChatSessionCreate, ChatMessage
from typing import Optional, List
from datetime import datetime


class ChatService:
    """Chat service for AI chatbot interactions"""
    
    def __init__(self, chat_repository: ChatSessionRepository):
        self.repo = chat_repository
    
    async def create_chat_session(self, user_email: str, session_data: ChatSessionCreate) -> dict:
        """Create a new chat session"""
        session_dict = session_data.dict()
        session_id = await self.repo.create_session(user_email, session_dict)
        
        return {
            "success": True,
            "session_id": session_id,
            "message": "Chat session created"
        }
    
    async def get_chat_session(self, session_id: str) -> Optional[dict]:
        """Get chat session by ID"""
        return await self.repo.get_by_id(session_id)
    
    async def get_user_chat_sessions(self, user_email: str) -> List[dict]:
        """Get all chat sessions for a user"""
        sessions = await self.repo.get_user_sessions(user_email)
        for session in sessions:
            session["id"] = str(session["_id"])
        return sessions
    
    async def add_user_message(self, session_id: str, user_message: str) -> bool:
        """Add user message to chat session"""
        message = {
            "role": "user",
            "content": user_message,
            "timestamp": datetime.utcnow().isoformat()
        }
        return await self.repo.add_message(session_id, message)
    
    async def add_assistant_message(self, session_id: str, assistant_message: str) -> bool:
        """Add assistant message to chat session"""
        message = {
            "role": "assistant",
            "content": assistant_message,
            "timestamp": datetime.utcnow().isoformat()
        }
        return await self.repo.add_message(session_id, message)
    
    async def get_ai_response(
        self,
        session_id: str,
        user_name: str,
        user_age: int,
        user_gender: str,
        symptoms: str,
        medical_condition: str
    ) -> dict:
        """Get AI response for health query"""
        # Get AI insights
        insights_response = await get_ai_health_insights(
            name=user_name,
            age=user_age,
            gender=user_gender,
            symptoms=symptoms,
            medical_condition=medical_condition
        )
        
        if not insights_response["success"]:
            return {
                "success": False,
                "error": "Failed to get AI response"
            }
        
        # Update session with insights
        await self.repo.update_insights(session_id, insights_response["insights"])
        
        return {
            "success": True,
            "insights": insights_response["insights"],
            "disclaimer": insights_response["disclaimer"]
        }
    
    async def get_session_summary(self, session_id: str) -> Optional[str]:
        """Generate summary of chat session"""
        session = await self.repo.get_by_id(session_id)
        if not session:
            return None
        
        # Convert messages to format needed for summary
        chat_history = [
            {"role": msg["role"], "content": msg["content"]}
            for msg in session.get("messages", [])
        ]
        
        if not chat_history:
            return None
        
        summary = await generate_health_summary(chat_history)
        
        # Store summary in session
        if summary:
            await self.repo.collection.update_one(
                {"_id": session["_id"]},
                {"$set": {"summary": summary}}
            )
        
        return summary
    
    async def delete_chat_session(self, session_id: str) -> bool:
        """Delete chat session"""
        return await self.repo.delete(session_id)
