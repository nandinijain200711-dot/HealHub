from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.schemas import (
    UserCreate, LoginRequest, TokenResponse, TokenData
)
from app.core.security import create_access_token, verify_token
from app.core.database import get_database
from app.repositories.base import UserRepository, AdminRepository
from app.services.user_service import UserService
from app.services.admin_service import AdminService
from app.schemas.schemas import AdminLoginRequest

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])
security = HTTPBearer()


# ==================== User Auth ====================

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db=Depends(get_database)):
    """Register a new user"""
    user_repo = UserRepository(db["users"])
    user_service = UserService(user_repo)
    
    result = await user_service.register_user(user_data)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    
    # Create access token
    token_data = {
        "user_id": result["user_id"],
        "email": user_data.email,
        "role": "user"
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": token_data
    }


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db=Depends(get_database)):
    """User login"""
    user_repo = UserRepository(db["users"])
    user_service = UserService(user_repo)
    
    user = await user_service.authenticate_user(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    token_data = {
        "user_id": user["user_id"],
        "email": user["email"],
        "role": "user"
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/verify-token")
async def verify_token_endpoint(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    return {
        "valid": True,
        "data": payload
    }


# ==================== Admin Auth ====================

@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(credentials: AdminLoginRequest, db=Depends(get_database)):
    """Admin login"""
    admin_repo = AdminRepository(db["admins"])
    admin_service = AdminService(admin_repo)
    
    admin = await admin_service.authenticate_admin(credentials.username, credentials.password)
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    # Create access token
    token_data = {
        "user_id": admin["admin_id"],
        "email": admin["email"],
        "role": "admin"
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": admin
    }


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current user from token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload or payload.get("role") != "user":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    return payload


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current admin from token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload or payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin access required"
        )
    
    return payload
