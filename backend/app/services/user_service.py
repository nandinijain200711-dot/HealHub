from app.repositories.base import UserRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.schemas import UserCreate, User
from typing import Optional


class UserService:
    """User service for business logic"""
    
    def __init__(self, user_repository: UserRepository):
        self.repo = user_repository
    
    async def register_user(self, user_data: UserCreate) -> dict:
        """Register a new user"""
        # Check if user already exists
        existing_user = await self.repo.get_by_email(user_data.email)
        if existing_user:
            return {"success": False, "message": "Email already registered"}
        
        # Create user
        user_dict = user_data.dict()
        user_dict["hashed_password"] = hash_password(user_data.password)
        del user_dict["password"]
        
        user_id = await self.repo.create_user(user_dict)
        
        return {
            "success": True,
            "user_id": user_id,
            "message": "User registered successfully"
        }
    
    async def authenticate_user(self, email: str, password: str) -> Optional[dict]:
        """Authenticate user and return user data"""
        user = await self.repo.get_by_email(email)
        if not user:
            return None
        
        if not verify_password(password, user.get("hashed_password", "")):
            return None
        
        return {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", ""),
            "age": user.get("age"),
            "gender": user.get("gender")
        }
    
    async def get_user(self, user_id: str) -> Optional[dict]:
        """Get user by ID"""
        user = await self.repo.get_by_id(user_id)
        if user:
            del user["hashed_password"]
            user["id"] = str(user["_id"])
            del user["_id"] 
            return user
    
    async def get_user_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        user = await self.repo.get_by_email(email)
        if user:
            del user["hashed_password"]
            user["id"] = str(user["_id"])
        return user
    
    async def update_user_profile(self, user_id: str, data: dict) -> bool:
        """Update user profile"""
        return await self.repo.update(user_id, data)
