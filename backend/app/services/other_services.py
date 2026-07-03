from app.repositories.base import (
    FAQRepository,
    DoctorRepository,
    ContactRepository,
    WebsiteContentRepository
)
from app.schemas.schemas import FAQCreate, FAQUpdate, DoctorCreate, DoctorUpdate, ContactUpdate
from typing import Optional, List


class FAQService:
    def __init__(self, faq_repository: FAQRepository):
        self.repo = faq_repository

    async def create_faq(self, faq_data: FAQCreate) -> dict:
        faq_dict = faq_data.dict()
        faq_id = await self.repo.create_faq(faq_dict)

        return {
            "success": True,
            "faq_id": faq_id,
            "message": "FAQ created successfully"
        }

    async def get_faq(self, faq_id: str) -> Optional[dict]:
        faq = await self.repo.get_by_id(faq_id)

        if faq:
            faq["id"] = str(faq["_id"])
            del faq["_id"]

        return faq

    async def get_all_faqs(self) -> List[dict]:
        faqs = await self.repo.get_all_sorted()

        for faq in faqs:
            faq["id"] = str(faq["_id"])
            del faq["_id"]

        return faqs

    async def get_faqs_by_category(self, category: str) -> List[dict]:
        faqs = await self.repo.get_by_category(category)

        for faq in faqs:
            faq["id"] = str(faq["_id"])
            del faq["_id"]

        return faqs

    async def update_faq(self, faq_id: str, faq_data: FAQUpdate) -> dict:
        update_dict = {k: v for k, v in faq_data.dict().items() if v is not None}

        success = await self.repo.update(faq_id, update_dict)

        return {
            "success": success,
            "message": "FAQ updated successfully" if success else "Failed to update FAQ"
        }

    async def delete_faq(self, faq_id: str) -> dict:
        success = await self.repo.delete(faq_id)

        return {
            "success": success,
            "message": "FAQ deleted successfully" if success else "Failed to delete FAQ"
        }


class DoctorService:
    def __init__(self, doctor_repository: DoctorRepository):
        self.repo = doctor_repository

    async def create_doctor(self, doctor_data: DoctorCreate) -> dict:
        doctor_dict = doctor_data.dict()
        doctor_id = await self.repo.create_doctor(doctor_dict)

        return {
            "success": True,
            "doctor_id": doctor_id,
            "message": "Doctor added successfully"
        }

    async def get_doctor(self, doctor_id: str) -> Optional[dict]:
        doctor = await self.repo.get_by_id(doctor_id)

        if doctor:
            doctor["id"] = str(doctor["_id"])
            del doctor["_id"]

        return doctor

    async def get_all_doctors(self) -> List[dict]:
        doctors = await self.repo.get_all()

        for doctor in doctors:
            doctor["id"] = str(doctor["_id"])
            del doctor["_id"]

        return doctors

    async def get_doctors_by_specialization(self, specialization: str) -> List[dict]:
        doctors = await self.repo.get_by_specialization(specialization)

        for doctor in doctors:
            doctor["id"] = str(doctor["_id"])
            del doctor["_id"]

        return doctors

    async def update_doctor(self, doctor_id: str, doctor_data: DoctorUpdate) -> dict:
        update_dict = {k: v for k, v in doctor_data.dict().items() if v is not None}

        success = await self.repo.update(doctor_id, update_dict)

        return {
            "success": success,
            "message": "Doctor updated successfully" if success else "Failed to update doctor"
        }

    async def delete_doctor(self, doctor_id: str) -> dict:
        success = await self.repo.delete(doctor_id)

        return {
            "success": success,
            "message": "Doctor deleted successfully" if success else "Failed to delete doctor"
        }


class ContactService:
    def __init__(self, contact_repository: ContactRepository):
        self.repo = contact_repository

    async def get_contact_info(self) -> Optional[dict]:
        contact = await self.repo.get_contact_info()

        if contact:
            contact["id"] = str(contact["_id"])
            del contact["_id"]

        return contact

    async def update_contact_info(self, contact_data: ContactUpdate) -> dict:
        update_dict = {k: v for k, v in contact_data.dict().items() if v is not None}

        success = await self.repo.update_contact_info(update_dict)

        return {
            "success": success,
            "message": "Contact information updated successfully" if success else "Failed to update contact information"
        }


class WebsiteContentService:
    def __init__(self, content_repository: WebsiteContentRepository):
        self.repo = content_repository

    async def get_content(self) -> Optional[dict]:
        content = await self.repo.get_content()

        if content:
            content["id"] = str(content["_id"])
            del content["_id"]

        return content

    async def update_content(self, content_data: dict) -> dict:
        success = await self.repo.update_content(content_data)

        return {
            "success": success,
            "message": "Website content updated successfully" if success else "Failed to update website content"
        }