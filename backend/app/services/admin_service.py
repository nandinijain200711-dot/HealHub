from app.repositories.base import AdminRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.schemas import AdminCreate
from typing import Optional


class AdminService:
    """Admin service for business logic"""
    
    def __init__(self, admin_repository: AdminRepository):
        self.repo = admin_repository
    
    async def create_admin(self, admin_data: AdminCreate) -> dict:
        """Create a new admin"""
        # Check if admin already exists
        existing_admin = await self.repo.get_by_username(admin_data.username)
        if existing_admin:
            return {"success": False, "message": "Username already taken"}
        
        # Create admin
        admin_dict = admin_data.dict()
        admin_dict["hashed_password"] = hash_password(admin_data.password)
        del admin_dict["password"]
        
        admin_id = await self.repo.create_admin(admin_dict)
        
        return {
            "success": True,
            "admin_id": admin_id,
            "message": "Admin created successfully"
        }
    
    async def authenticate_admin(self, username: str, password: str) -> Optional[dict]:
        """Authenticate admin and return admin data"""
        admin = await self.repo.get_by_username(username)
        if not admin:
            return None
        
        if not verify_password(password, admin.get("hashed_password", "")):
            return None
        
        return {
            "admin_id": str(admin["_id"]),
            "username": admin["username"],
            "email": admin["email"],
            "full_name": admin.get("full_name", "")
        }
    
    async def get_admin(self, admin_id: str) -> Optional[dict]:
        """Get admin by ID"""
        admin = await self.repo.get_by_id(admin_id)
        if admin:
            del admin["hashed_password"]
            admin["id"] = str(admin["_id"])
        return admin
    
    async def get_all_admins(self) -> list:
        """Get all admins"""
        admins = await self.repo.get_all()
        for admin in admins:
            if "hashed_password" in admin:
                del admin["hashed_password"]
            admin["id"] = str(admin["_id"])
        return admins
    
    async def update_admin(self, admin_id: str, data: dict) -> bool:
        """Update admin"""
        if "password" in data:
            data["hashed_password"] = hash_password(data["password"])
            del data["password"]
        
        return await self.repo.update(admin_id, data)
    
    async def delete_admin(self, admin_id: str) -> bool:
        """Delete admin"""
        return await self.repo.delete(admin_id)
