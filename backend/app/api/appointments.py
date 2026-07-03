from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schemas.schemas import AppointmentCreate, AppointmentUpdate
from app.core.database import get_database
from app.repositories.base import AppointmentRepository
from app.services.appointment_service import AppointmentService
from app.api.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/v1/appointments", tags=["Appointments"])


@router.post("/book")
async def book_appointment(
    appointment_data: AppointmentCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Book a new appointment"""
    appointment_repo = AppointmentRepository(db["appointments"])
    appointment_service = AppointmentService(appointment_repo)
    
    # Verify email matches
    if appointment_data.user_email != current_user["email"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot book appointment for another user"
        )
    
    result = await appointment_service.create_appointment(appointment_data)
    
    return result


@router.get("/user/my-appointments")
async def get_my_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Get current user's appointments"""
    appointment_repo = AppointmentRepository(db["appointments"])
    appointment_service = AppointmentService(appointment_repo)
    
    appointments = await appointment_service.get_user_appointments(current_user["email"])
    
    # Apply pagination
    appointments = appointments[skip:skip+limit]
    
    return {
        "total": len(appointments),
        "skip": skip,
        "limit": limit,
        "appointments": appointments
    }


@router.get("/{appointment_id}")
async def get_appointment(
    appointment_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Get appointment details"""
    appointment_repo = AppointmentRepository(db["appointments"])
    appointment_service = AppointmentService(appointment_repo)
    
    appointment = await appointment_service.get_appointment(appointment_id)
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Verify ownership or admin
    if appointment["user_email"] != current_user["email"] and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this appointment"
        )
    
    return appointment


@router.get("")
async def get_all_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: str = Query(None),
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get all appointments (Admin only)"""
    appointment_repo = AppointmentRepository(db["appointments"])
    appointment_service = AppointmentService(appointment_repo)
    
    if status:
        appointments = await appointment_service.get_appointments_by_status(status)
        appointments = appointments[skip:skip+limit]
        return {
            "total": len(appointments),
            "skip": skip,
            "limit": limit,
            "appointments": appointments
        }
    else:
        return await appointment_service.get_all_appointments(skip=skip, limit=limit)


@router.put("/{appointment_id}")
async def update_appointment(
    appointment_id: str,
    appointment_data: AppointmentUpdate,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Update appointment"""
    appointment_repo = AppointmentRepository(db["appointments"])
    appointment_service = AppointmentService(appointment_repo)
    
    # Get appointment
    appointment = await appointment_service.get_appointment(appointment_id)
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Verify ownership
    if appointment["user_email"] != current_user["email"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this appointment"
        )
    
    result = await appointment_service.update_appointment(appointment_id, appointment_data)
    
    return result


@router.post("/{appointment_id}/cancel")
async def cancel_appointment(
    appointment_id: str,
    reason: str = None,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Cancel appointment"""
    appointment_repo = AppointmentRepository(db["appointments"])
    appointment_service = AppointmentService(appointment_repo)
    
    # Get appointment
    appointment = await appointment_service.get_appointment(appointment_id)
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Verify ownership or admin
    if appointment["user_email"] != current_user["email"] and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this appointment"
        )
    
    result = await appointment_service.cancel_appointment(appointment_id, reason)
    
    return result


@router.post("/{appointment_id}/confirm")
async def confirm_appointment(
    appointment_id: str,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Confirm appointment (Admin only)"""
    appointment_repo = AppointmentRepository(db["appointments"])
    appointment_service = AppointmentService(appointment_repo)
    
    result = await appointment_service.confirm_appointment(appointment_id)
    
    return result


@router.post("/{appointment_id}/complete")
async def complete_appointment(
    appointment_id: str,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Mark appointment as completed (Admin only)"""
    appointment_repo = AppointmentRepository(db["appointments"])
    appointment_service = AppointmentService(appointment_repo)
    
    result = await appointment_service.complete_appointment(appointment_id)
    
    return result
