from app.repositories.base import AppointmentRepository
from app.utils.email import send_appointment_confirmation
from app.core.config import settings
from app.schemas.schemas import AppointmentCreate, AppointmentUpdate
from typing import Optional, List


class AppointmentService:
    """Appointment service for managing appointments"""
    
    def __init__(self, appointment_repository: AppointmentRepository):
        self.repo = appointment_repository
    
    def _sanitize_appointment(self, appointment: dict) -> dict:
        if not appointment:
            return appointment
        appointment["id"] = str(appointment["_id"])
        appointment.pop("_id", None)
        return appointment
    
    async def create_appointment(self, appointment_data: AppointmentCreate) -> dict:
        """Create a new appointment"""
        appointment_dict = appointment_data.dict()
        appointment_dict["meet_link"] = settings.GOOGLE_MEET_LINK
        
        appointment_id = await self.repo.create_appointment(appointment_dict)
        
        # Send confirmation emails
        await send_appointment_confirmation(
            user_email=appointment_data.user_email,
            user_name=appointment_data.user_name,
            appointment_date=appointment_data.appointment_date,
            appointment_time=appointment_data.appointment_time,
            reason=appointment_data.reason,
            admin_email=settings.ADMIN_EMAIL
        )
        
        return {
            "success": True,
            "appointment_id": appointment_id,
            "message": "Appointment booked successfully",
            "meet_link": settings.GOOGLE_MEET_LINK
        }
    
    async def get_appointment(self, appointment_id: str) -> Optional[dict]:
        """Get appointment by ID"""
        appointment = await self.repo.get_by_id(appointment_id)
        return self._sanitize_appointment(appointment) if appointment else None
    
    async def get_user_appointments(self, user_email: str) -> List[dict]:
        """Get appointments for a user"""
        appointments = await self.repo.get_user_appointments(user_email)
        return [self._sanitize_appointment(appointment) for appointment in appointments]
    
    async def get_all_appointments(self, skip: int = 0, limit: int = 100) -> dict:
        """Get all appointments with pagination"""
        appointments = await self.repo.get_all(skip=skip, limit=limit)
        sanitized = [self._sanitize_appointment(appointment) for appointment in appointments]
        
        total = await self.repo.count()
        
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "appointments": sanitized
        }
    
    async def get_appointments_by_status(self, status: str) -> List[dict]:
        """Get appointments by status"""
        appointments = await self.repo.get_appointments_by_status(status)
        return [self._sanitize_appointment(appointment) for appointment in appointments]
    
    async def update_appointment(self, appointment_id: str, appointment_data: AppointmentUpdate) -> dict:
        """Update appointment"""
        update_dict = {k: v for k, v in appointment_data.dict().items() if v is not None}
        
        success = await self.repo.update(appointment_id, update_dict)
        
        if success:
            return {
                "success": True,
                "message": "Appointment updated successfully"
            }
        else:
            return {
                "success": False,
                "message": "Failed to update appointment"
            }
    
    async def cancel_appointment(self, appointment_id: str, reason: Optional[str] = None) -> dict:
        """Cancel appointment"""
        success = await self.repo.update_status(
            appointment_id,
            "cancelled",
            notes=reason
        )
        
        if success:
            return {
                "success": True,
                "message": "Appointment cancelled successfully"
            }
        else:
            return {
                "success": False,
                "message": "Failed to cancel appointment"
            }
    
    async def confirm_appointment(self, appointment_id: str) -> dict:
        """Confirm appointment"""
        success = await self.repo.update_status(appointment_id, "confirmed")
        
        if success:
            return {
                "success": True,
                "message": "Appointment confirmed successfully"
            }
        else:
            return {
                "success": False,
                "message": "Failed to confirm appointment"
            }
    
    async def complete_appointment(self, appointment_id: str) -> dict:
        """Mark appointment as completed"""
        success = await self.repo.update_status(appointment_id, "completed")
        
        if success:
            return {
                "success": True,
                "message": "Appointment marked as completed"
            }
        else:
            return {
                "success": False,
                "message": "Failed to mark appointment as completed"
            }
