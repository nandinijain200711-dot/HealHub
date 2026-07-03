from fastapi import APIRouter, Depends, HTTPException, status, Query
from datetime import datetime
from app.schemas.schemas import AdminCreate
from app.core.database import get_database
from app.repositories.base import AdminRepository, ChatSessionRepository, AppointmentRepository
from app.services.admin_service import AdminService
from app.services.chat_service import ChatService
from app.services.appointment_service import AppointmentService
from app.api.auth import get_current_admin

router = APIRouter(prefix="/api/v1/admin", tags=["Admin Panel"])


# ==================== Admin Management ====================

@router.get("/me")
async def get_admin_profile(
    current_admin=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get current admin profile"""
    admin_repo = AdminRepository(db["admins"])
    admin_service = AdminService(admin_repo)
    
    admin = await admin_service.get_admin(current_admin["user_id"])
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    
    return admin


@router.get("/admins")
async def get_all_admins(
    current_admin=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get all admins (Admin only)"""
    admin_repo = AdminRepository(db["admins"])
    admin_service = AdminService(admin_repo)
    
    admins = await admin_service.get_all_admins()
    
    return {
        "total": len(admins),
        "admins": admins
    }


@router.post("/admins")
async def create_admin(
    admin_data: AdminCreate,
    current_admin=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Create new admin (Admin only)"""
    admin_repo = AdminRepository(db["admins"])
    admin_service = AdminService(admin_repo)
    
    result = await admin_service.create_admin(admin_data)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    
    return result


@router.delete("/admins/{admin_id}")
async def delete_admin(
    admin_id: str,
    current_admin=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Delete admin (Admin only)"""
    # Prevent self-deletion
    if admin_id == current_admin["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
    
    admin_repo = AdminRepository(db["admins"])
    admin_service = AdminService(admin_repo)
    
    success = await admin_service.delete_admin(admin_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete admin"
        )
    
    return {
        "success": True,
        "message": "Admin deleted successfully"
    }


# ==================== Dashboard Stats ====================

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_admin=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get dashboard statistics"""
    # Count documents in collections
    users_count = await db["users"].count_documents({})
    appointments_count = await db["appointments"].count_documents({})
    chat_sessions_count = await db["chat_sessions"].count_documents({})
    faqs_count = await db["faqs"].count_documents({})
    doctors_count = await db["doctors"].count_documents({})
    
    # Count appointments by status
    pending = await db["appointments"].count_documents({"status": "pending"})
    confirmed = await db["appointments"].count_documents({"status": "confirmed"})
    completed = await db["appointments"].count_documents({"status": "completed"})
    cancelled = await db["appointments"].count_documents({"status": "cancelled"})
    
    return {
        "users_total": users_count,
        "appointments_total": appointments_count,
        "appointments_pending": pending,
        "appointments_confirmed": confirmed,
        "appointments_completed": completed,
        "appointments_cancelled": cancelled,
        "chat_sessions_total": chat_sessions_count,
        "faqs_total": faqs_count,
        "doctors_total": doctors_count
    }


# ==================== Chat History ====================

@router.get("/chat-history")
async def get_chat_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_admin=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get all chat history (Admin only)"""
    chat_sessions = await db["chat_sessions"].find()\
        .sort("created_at", -1)\
        .skip(skip)\
        .limit(limit)\
        .to_list(length=limit)
    
    for session in chat_sessions:
        session["id"] = str(session["_id"])
    
    total = await db["chat_sessions"].count_documents({})
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "chat_sessions": chat_sessions
    }


@router.get("/chat-history/{session_id}")
async def get_chat_history_details(
    session_id: str,
    current_admin=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get specific chat session details (Admin only)"""
    from bson.objectid import ObjectId
    
    try:
        session = await db["chat_sessions"].find_one({"_id": ObjectId(session_id)})
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )
        
        session["id"] = str(session["_id"])
        return session
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )


# ==================== User Management ====================

@router.get("/users")
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_admin=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get all users (Admin only)"""
    users = await db["users"].find()\
        .skip(skip)\
        .limit(limit)\
        .to_list(length=limit)
    
    for user in users:
        if "hashed_password" in user:
            del user["hashed_password"]
        user["id"] = str(user["_id"])
    
    total = await db["users"].count_documents({})
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "users": users
    }


# ==================== System Health ====================

@router.get("/health")
async def health_check(
    current_admin=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Check system health (Admin only)"""
    try:
        # Test database connection
        await db.command("ping")
        
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
