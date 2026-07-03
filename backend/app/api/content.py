from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schemas.schemas import FAQCreate, FAQUpdate, DoctorCreate, DoctorUpdate, ContactUpdate
from app.core.database import get_database
from app.repositories.base import FAQRepository, DoctorRepository, ContactRepository, WebsiteContentRepository
from app.services.other_services import FAQService, DoctorService, ContactService, WebsiteContentService
from app.api.auth import get_current_admin

router = APIRouter(prefix="/api/v1", tags=["Content Management"])


# ==================== FAQ Routes ====================

@router.get("/faqs")
async def get_all_faqs(db=Depends(get_database)):
    """Get all FAQs"""
    faq_repo = FAQRepository(db["faqs"])
    faq_service = FAQService(faq_repo)
    
    faqs = await faq_service.get_all_faqs()
    
    return {
        "total": len(faqs),
        "faqs": faqs
    }


@router.get("/faqs/category/{category}")
async def get_faqs_by_category(
    category: str,
    db=Depends(get_database)
):
    """Get FAQs by category"""
    faq_repo = FAQRepository(db["faqs"])
    faq_service = FAQService(faq_repo)
    
    faqs = await faq_service.get_faqs_by_category(category)
    
    return {
        "total": len(faqs),
        "category": category,
        "faqs": faqs
    }


@router.get("/faqs/{faq_id}")
async def get_faq(
    faq_id: str,
    db=Depends(get_database)
):
    """Get specific FAQ"""
    faq_repo = FAQRepository(db["faqs"])
    faq_service = FAQService(faq_repo)
    
    faq = await faq_service.get_faq(faq_id)
    
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )
    
    return faq


@router.post("/faqs")
async def create_faq(
    faq_data: FAQCreate,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Create new FAQ (Admin only)"""
    faq_repo = FAQRepository(db["faqs"])
    faq_service = FAQService(faq_repo)
    
    result = await faq_service.create_faq(faq_data)
    
    return result


@router.put("/faqs/{faq_id}")
async def update_faq(
    faq_id: str,
    faq_data: FAQUpdate,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Update FAQ (Admin only)"""
    faq_repo = FAQRepository(db["faqs"])
    faq_service = FAQService(faq_repo)
    
    result = await faq_service.update_faq(faq_id, faq_data)
    
    return result


@router.delete("/faqs/{faq_id}")
async def delete_faq(
    faq_id: str,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Delete FAQ (Admin only)"""
    faq_repo = FAQRepository(db["faqs"])
    faq_service = FAQService(faq_repo)
    
    result = await faq_service.delete_faq(faq_id)
    
    return result


# ==================== Doctor Routes ====================

@router.get("/doctors")
async def get_all_doctors(db=Depends(get_database)):
    """Get all doctors"""
    doctor_repo = DoctorRepository(db["doctors"])
    doctor_service = DoctorService(doctor_repo)
    
    doctors = await doctor_service.get_all_doctors()
    
    return {
        "total": len(doctors),
        "doctors": doctors
    }


@router.get("/doctors/specialization/{specialization}")
async def get_doctors_by_specialization(
    specialization: str,
    db=Depends(get_database)
):
    """Get doctors by specialization"""
    doctor_repo = DoctorRepository(db["doctors"])
    doctor_service = DoctorService(doctor_repo)
    
    doctors = await doctor_service.get_doctors_by_specialization(specialization)
    
    return {
        "total": len(doctors),
        "specialization": specialization,
        "doctors": doctors
    }


@router.get("/doctors/{doctor_id}")
async def get_doctor(
    doctor_id: str,
    db=Depends(get_database)
):
    """Get specific doctor"""
    doctor_repo = DoctorRepository(db["doctors"])
    doctor_service = DoctorService(doctor_repo)
    
    doctor = await doctor_service.get_doctor(doctor_id)
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    return doctor


@router.post("/doctors")
async def create_doctor(
    doctor_data: DoctorCreate,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Create new doctor (Admin only)"""
    doctor_repo = DoctorRepository(db["doctors"])
    doctor_service = DoctorService(doctor_repo)
    
    result = await doctor_service.create_doctor(doctor_data)
    
    return result


@router.put("/doctors/{doctor_id}")
async def update_doctor(
    doctor_id: str,
    doctor_data: DoctorUpdate,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Update doctor (Admin only)"""
    doctor_repo = DoctorRepository(db["doctors"])
    doctor_service = DoctorService(doctor_repo)
    
    result = await doctor_service.update_doctor(doctor_id, doctor_data)
    
    return result


@router.delete("/doctors/{doctor_id}")
async def delete_doctor(
    doctor_id: str,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Delete doctor (Admin only)"""
    doctor_repo = DoctorRepository(db["doctors"])
    doctor_service = DoctorService(doctor_repo)
    
    result = await doctor_service.delete_doctor(doctor_id)
    
    return result


# ==================== Contact Routes ====================

@router.get("/contact")
async def get_contact(db=Depends(get_database)):
    """Get contact information"""
    contact_repo = ContactRepository(db["contact"])
    contact_service = ContactService(contact_repo)
    
    contact = await contact_service.get_contact_info()
    
    if not contact:
        return {
            "address": "",
            "phone": "",
            "email": "",
            "business_hours": "",
            "emergency_contact": ""
        }
    
    return contact


@router.put("/contact")
async def update_contact(
    contact_data: ContactUpdate,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Update contact information (Admin only)"""
    contact_repo = ContactRepository(db["contact"])
    contact_service = ContactService(contact_repo)
    
    result = await contact_service.update_contact_info(contact_data)
    
    return result


# ==================== Website Content Routes ====================

@router.get("/content")
async def get_website_content(db=Depends(get_database)):
    """Get website content"""
    content_repo = WebsiteContentRepository(db["website_content"])
    content_service = WebsiteContentService(content_repo)
    
    content = await content_service.get_content()
    
    if not content:
        return {
            "home_headline": "Welcome to HealHub",
            "home_subheading": "Your AI-Powered Healthcare Platform",
            "about_content": "",
            "benefits_title": "Why Choose HealHub?",
            "benefits_list": [],
            "testimonials": []
        }
    
    return content


@router.put("/content")
async def update_website_content(
    content_data: dict,
    current_user=Depends(get_current_admin),
    db=Depends(get_database)
):
    """Update website content (Admin only)"""
    content_repo = WebsiteContentRepository(db["website_content"])
    content_service = WebsiteContentService(content_repo)
    
    result = await content_service.update_content(content_data)
    
    return result
