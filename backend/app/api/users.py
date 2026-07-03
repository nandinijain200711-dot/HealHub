from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.schemas import UserUpdate
from app.core.database import get_database
from app.repositories.base import UserRepository
from app.services.user_service import UserService
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/v1/users", tags=["User Profile"])


@router.get("/me")
async def get_current_user_profile(
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Get current user profile"""
    user_repo = UserRepository(db["users"])
    user_service = UserService(user_repo)
    
    user = await user_service.get_user(current_user["user_id"])
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/me")
async def update_user_profile(
    user_data: UserUpdate,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Update current user profile"""
    user_repo = UserRepository(db["users"])
    user_service = UserService(user_repo)
    
    update_dict = {k: v for k, v in user_data.dict().items() if v is not None}
    
    success = await user_service.update_user_profile(current_user["user_id"], update_dict)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )
    
    return {
        "success": True,
        "message": "Profile updated successfully"
    }


@router.get("/{user_id}")
async def get_user_profile(
    user_id: str,
    db=Depends(get_database)
):
    """Get user profile (public)"""
    user_repo = UserRepository(db["users"])
    user_service = UserService(user_repo)
    
    user = await user_service.get_user(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Remove sensitive info
    if "hashed_password" in user:
        del user["hashed_password"]
    
    return user
