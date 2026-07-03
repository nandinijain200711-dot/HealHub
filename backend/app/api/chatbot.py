from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.schemas import ChatSessionCreate, ChatMessageRequest
from app.core.database import get_database
from app.repositories.base import ChatSessionRepository
from app.services.chat_service import ChatService
from app.api.auth import get_current_user
from typing import List

router = APIRouter(prefix="/api/v1/chatbot", tags=["Chatbot"])


@router.post("/session/create")
async def create_chat_session(
    session_data: ChatSessionCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Create a new chat session"""
    chat_repo = ChatSessionRepository(db["chat_sessions"])
    chat_service = ChatService(chat_repo)
    
    result = await chat_service.create_chat_session(
        current_user["email"],
        session_data
    )
    
    return result


@router.get("/session/{session_id}")
async def get_chat_session(
    session_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Get chat session"""
    chat_repo = ChatSessionRepository(db["chat_sessions"])
    chat_service = ChatService(chat_repo)
    
    session = await chat_service.get_chat_session(session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # Verify ownership
    if session["user_email"] != current_user["email"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this session"
        )
    
    session["id"] = str(session["_id"])
    return session


@router.get("/sessions")
async def get_user_sessions(
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Get all chat sessions for user"""
    chat_repo = ChatSessionRepository(db["chat_sessions"])
    chat_service = ChatService(chat_repo)
    
    sessions = await chat_service.get_user_chat_sessions(current_user["email"])
    
    return {
        "total": len(sessions),
        "sessions": sessions
    }


@router.post("/session/{session_id}/message")
async def send_message(
    session_id: str,
    message_data: ChatMessageRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Send message and get AI response"""
    chat_repo = ChatSessionRepository(db["chat_sessions"])
    chat_service = ChatService(chat_repo)
    
    # Get session
    session = await chat_service.get_chat_session(session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # Verify ownership
    if session["user_email"] != current_user["email"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this session"
        )
    
    # Add user message
    await chat_service.add_user_message(session_id, message_data.user_message)
    
    # Get AI response
    ai_response = await chat_service.get_ai_response(
        session_id=session_id,
        user_name=session["user_name"],
        user_age=session["user_age"],
        user_gender=session["user_gender"],
        symptoms=session.get("initial_symptom", ""),
        medical_condition=message_data.user_message
    )
    
    if not ai_response["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get AI response"
        )
    
    # Add assistant message
    await chat_service.add_assistant_message(session_id, ai_response["insights"])
    
    return {
        "success": True,
        "session_id": session_id,
        "insights": ai_response["insights"],
        "disclaimer": ai_response["disclaimer"]
    }


@router.get("/session/{session_id}/summary")
async def get_session_summary(
    session_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Get chat session summary"""
    chat_repo = ChatSessionRepository(db["chat_sessions"])
    chat_service = ChatService(chat_repo)
    
    # Get session
    session = await chat_service.get_chat_session(session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # Verify ownership
    if session["user_email"] != current_user["email"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this session"
        )
    
    summary = await chat_service.get_session_summary(session_id)
    
    return {
        "session_id": session_id,
        "summary": summary
    }


@router.delete("/session/{session_id}")
async def delete_chat_session(
    session_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Delete chat session"""
    chat_repo = ChatSessionRepository(db["chat_sessions"])
    chat_service = ChatService(chat_repo)
    
    # Get session
    session = await chat_service.get_chat_session(session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # Verify ownership
    if session["user_email"] != current_user["email"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this session"
        )
    
    success = await chat_service.delete_chat_session(session_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete session"
        )
    
    return {
        "success": True,
        "message": "Chat session deleted successfully"
    }
