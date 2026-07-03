from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ==================== Enums ====================

class GenderEnum(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class AppointmentStatusEnum(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# ==================== User Schemas ====================

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[GenderEnum] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[GenderEnum] = None


class User(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(populate_by_name=True)


class UserInDB(User):
    hashed_password: str


# ==================== Admin Schemas ====================

class AdminBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)


class AdminCreate(AdminBase):
    password: str = Field(..., min_length=8)


class Admin(AdminBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    model_config = ConfigDict(populate_by_name=True)


class AdminInDB(Admin):
    hashed_password: str


# ==================== Chat Schemas ====================

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatSessionBase(BaseModel):
    user_name: str
    user_age: int
    user_gender: GenderEnum
    initial_symptom: str


class ChatSessionCreate(ChatSessionBase):
    user_email: str


class ChatSession(ChatSessionBase):
    id: str = Field(alias="_id")
    user_email: str
    messages: List[ChatMessage] = Field(default_factory=list)
    ai_insights: Optional[str] = None
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(populate_by_name=True)


class ChatMessageRequest(BaseModel):
    user_message: str = Field(..., min_length=1, max_length=2000)


# ==================== Appointment Schemas ====================

class AppointmentBase(BaseModel):
    user_name: str = Field(..., min_length=2, max_length=100)
    user_email: EmailStr
    user_phone: str = Field(..., min_length=10, max_length=20)
    appointment_date: str  # Format: YYYY-MM-DD
    appointment_time: str  # Format: HH:MM
    reason: str = Field(..., min_length=10, max_length=500)


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = None
    reason: Optional[str] = None
    status: Optional[AppointmentStatusEnum] = None
    notes: Optional[str] = None


class Appointment(AppointmentBase):
    id: str = Field(alias="_id")
    status: AppointmentStatusEnum = AppointmentStatusEnum.PENDING
    meet_link: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(populate_by_name=True)


# ==================== FAQ Schemas ====================

class FAQBase(BaseModel):
    question: str = Field(..., min_length=10, max_length=500)
    answer: str = Field(..., min_length=20, max_length=3000)
    category: str = Field(..., min_length=3, max_length=50)
    order: int = 0


class FAQCreate(FAQBase):
    pass


class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None


class FAQ(FAQBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(populate_by_name=True)


# ==================== Doctor Schemas ====================

class DoctorBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    specialization: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    experience_years: int = Field(..., ge=0)
    bio: Optional[str] = None


class DoctorCreate(DoctorBase):
    pass


class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None


class Doctor(DoctorBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(populate_by_name=True)


# ==================== Contact Schemas ====================

class ContactBase(BaseModel):
    address: str = Field(..., min_length=10, max_length=500)
    phone: str = Field(..., min_length=10, max_length=20)
    email: EmailStr
    business_hours: str
    emergency_contact: Optional[str] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    business_hours: Optional[str] = None
    emergency_contact: Optional[str] = None


class Contact(ContactBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(populate_by_name=True)


# ==================== Website Content Schemas ====================

class WebsiteContent(BaseModel):
    home_headline: str = "Welcome to HealHub"
    home_subheading: str = "Your AI-Powered Healthcare Platform"
    about_content: str = ""
    benefits_title: str = "Why Choose HealHub?"
    benefits_list: List[str] = Field(default_factory=list)
    testimonials: List[dict] = Field(default_factory=list)
    updated_at: datetime


# ==================== Auth Schemas ====================

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[dict] = None


class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None
    role: Optional[str] = None  # "user" or "admin"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminLoginRequest(BaseModel):
    username: str
    password: str
