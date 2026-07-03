# 🏥 HealHub API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "1234567890",
  "age": 30,
  "gender": "male"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "age": 30,
    "gender": "male",
    "role": "user"
  }
}
```

**Errors:**
- 400: Email already registered

---

### 2. User Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Errors:**
- 401: Invalid credentials

---

### 3. Admin Login
**POST** `/auth/admin/login`

**Request:**
```json
{
  "username": "admin",
  "password": "AdminPassword123!"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "admin_id": "507f1f77bcf86cd799439012",
    "username": "admin",
    "email": "admin@healhub.com",
    "full_name": "Administrator",
    "role": "admin"
  }
}
```

**Errors:**
- 401: Invalid admin credentials

---

### 4. Verify Token
**POST** `/auth/verify-token`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "valid": true,
  "data": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "role": "user",
    "exp": 1708234567
  }
}
```

---

## 👤 User Profile Endpoints

### 1. Get Current User Profile
**GET** `/users/me`

**Auth:** ✅ Required

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "age": 30,
  "gender": "male",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

---

### 2. Update User Profile
**PUT** `/users/me`

**Auth:** ✅ Required

**Request:**
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "age": 31,
  "gender": "male"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

### 3. Get Public User Profile
**GET** `/users/{user_id}`

**Auth:** ❌ Not required

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "age": 30,
  "gender": "male",
  "created_at": "2024-01-15T10:30:00"
}
```

---

## 💬 Chatbot Endpoints

### 1. Create Chat Session
**POST** `/chatbot/session/create`

**Auth:** ✅ Required

**Request:**
```json
{
  "user_name": "John Doe",
  "user_age": 30,
  "user_gender": "male",
  "initial_symptom": "I have a headache",
  "user_email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "session_id": "507f1f77bcf86cd799439013",
  "message": "Chat session created"
}
```

---

### 2. Get Chat Session
**GET** `/chatbot/session/{session_id}`

**Auth:** ✅ Required

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "_id": "507f1f77bcf86cd799439013",
  "user_name": "John Doe",
  "user_age": 30,
  "user_gender": "male",
  "initial_symptom": "I have a headache",
  "user_email": "john@example.com",
  "messages": [
    {
      "role": "user",
      "content": "I have a headache",
      "timestamp": "2024-01-15T10:35:00"
    },
    {
      "role": "assistant",
      "content": "I understand you're experiencing a headache...",
      "timestamp": "2024-01-15T10:36:00"
    }
  ],
  "ai_insights": null,
  "summary": null,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:36:00"
}
```

---

### 3. Get All User Sessions
**GET** `/chatbot/sessions`

**Auth:** ✅ Required

**Response (200):**
```json
{
  "total": 2,
  "sessions": [
    {
      "id": "507f1f77bcf86cd799439013",
      "user_name": "John Doe",
      "user_age": 30,
      "messages": [...],
      "created_at": "2024-01-15T10:30:00"
    }
  ]
}
```

---

### 4. Send Message (Get AI Response)
**POST** `/chatbot/session/{session_id}/message`

**Auth:** ✅ Required

**Request:**
```json
{
  "user_message": "My headache is getting worse and I feel nauseous"
}
```

**Response (200):**
```json
{
  "success": true,
  "session_id": "507f1f77bcf86cd799439013",
  "insights": "Based on your symptoms of worsening headache and nausea...",
  "disclaimer": "This is general health information and not a substitute for professional medical advice."
}
```

---

### 5. Get Session Summary
**GET** `/chatbot/session/{session_id}/summary`

**Auth:** ✅ Required

**Response (200):**
```json
{
  "session_id": "507f1f77bcf86cd799439013",
  "summary": "Patient reports headache and nausea. Recommendations include rest, hydration, and monitoring symptoms..."
}
```

---

### 6. Delete Chat Session
**DELETE** `/chatbot/session/{session_id}`

**Auth:** ✅ Required

**Response (200):**
```json
{
  "success": true,
  "message": "Chat session deleted successfully"
}
```

---

## 📅 Appointment Endpoints

### 1. Book Appointment
**POST** `/appointments/book`

**Auth:** ✅ Required

**Request:**
```json
{
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_phone": "1234567890",
  "appointment_date": "2024-02-15",
  "appointment_time": "14:00",
  "reason": "General checkup and health consultation"
}
```

**Response (200):**
```json
{
  "success": true,
  "appointment_id": "507f1f77bcf86cd799439014",
  "message": "Appointment booked successfully",
  "meet_link": "https://meet.google.com/abc-defg-hij"
}
```

---

### 2. Get Appointment
**GET** `/appointments/{appointment_id}`

**Auth:** ✅ Required

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439014",
  "_id": "507f1f77bcf86cd799439014",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_phone": "1234567890",
  "appointment_date": "2024-02-15",
  "appointment_time": "14:00",
  "reason": "General checkup",
  "status": "pending",
  "meet_link": "https://meet.google.com/abc-defg-hij",
  "notes": null,
  "created_at": "2024-01-15T10:40:00",
  "updated_at": "2024-01-15T10:40:00"
}
```

---

### 3. Get My Appointments
**GET** `/appointments/user/my-appointments?skip=0&limit=10`

**Auth:** ✅ Required

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Number of records to return (default: 10, max: 100)

**Response (200):**
```json
{
  "total": 1,
  "skip": 0,
  "limit": 10,
  "appointments": [
    {
      "id": "507f1f77bcf86cd799439014",
      "user_name": "John Doe",
      "appointment_date": "2024-02-15",
      "status": "pending"
    }
  ]
}
```

---

### 4. Get All Appointments (Admin)
**GET** `/appointments?skip=0&limit=10&status=pending`

**Auth:** ✅ Required (Admin only)

**Query Parameters:**
- `skip`: Number of records to skip
- `limit`: Number of records to return
- `status`: Filter by status (pending, confirmed, completed, cancelled)

**Response (200):**
```json
{
  "total": 25,
  "skip": 0,
  "limit": 10,
  "appointments": [...]
}
```

---

### 5. Update Appointment
**PUT** `/appointments/{appointment_id}`

**Auth:** ✅ Required

**Request:**
```json
{
  "appointment_date": "2024-02-16",
  "appointment_time": "15:00",
  "reason": "Updated reason"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment updated successfully"
}
```

---

### 6. Cancel Appointment
**POST** `/appointments/{appointment_id}/cancel`

**Auth:** ✅ Required

**Query Parameter:**
- `reason`: Cancellation reason (optional)

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

---

### 7. Confirm Appointment (Admin)
**POST** `/appointments/{appointment_id}/confirm`

**Auth:** ✅ Required (Admin only)

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment confirmed successfully"
}
```

---

### 8. Complete Appointment (Admin)
**POST** `/appointments/{appointment_id}/complete`

**Auth:** ✅ Required (Admin only)

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment marked as completed"
}
```

---

## ❓ FAQ Endpoints

### 1. Get All FAQs
**GET** `/faqs`

**Auth:** ❌ Not required

**Response (200):**
```json
{
  "total": 4,
  "faqs": [
    {
      "id": "507f1f77bcf86cd799439015",
      "question": "What is HealHub?",
      "answer": "HealHub is an AI-powered healthcare platform...",
      "category": "General",
      "order": 1,
      "created_at": "2024-01-10T08:00:00"
    }
  ]
}
```

---

### 2. Get FAQs by Category
**GET** `/faqs/category/{category}`

**Auth:** ❌ Not required

**Response (200):**
```json
{
  "total": 2,
  "category": "Appointments",
  "faqs": [...]
}
```

---

### 3. Get Specific FAQ
**GET** `/faqs/{faq_id}`

**Auth:** ❌ Not required

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439015",
  "question": "What is HealHub?",
  "answer": "HealHub is an AI-powered healthcare platform...",
  "category": "General",
  "order": 1
}
```

---

### 4. Create FAQ (Admin)
**POST** `/faqs`

**Auth:** ✅ Required (Admin only)

**Request:**
```json
{
  "question": "How long does an appointment take?",
  "answer": "Appointments typically last 30 minutes...",
  "category": "Appointments",
  "order": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "faq_id": "507f1f77bcf86cd799439016",
  "message": "FAQ created successfully"
}
```

---

### 5. Update FAQ (Admin)
**PUT** `/faqs/{faq_id}`

**Auth:** ✅ Required (Admin only)

**Request:**
```json
{
  "answer": "Updated answer...",
  "order": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "FAQ updated successfully"
}
```

---

### 6. Delete FAQ (Admin)
**DELETE** `/faqs/{faq_id}`

**Auth:** ✅ Required (Admin only)

**Response (200):**
```json
{
  "success": true,
  "message": "FAQ deleted successfully"
}
```

---

## 👨‍⚕️ Doctor Endpoints

### 1. Get All Doctors
**GET** `/doctors`

**Auth:** ❌ Not required

**Response (200):**
```json
{
  "total": 3,
  "doctors": [
    {
      "id": "507f1f77bcf86cd799439017",
      "name": "Dr. Sarah Johnson",
      "specialization": "General Practice",
      "email": "sarah@healhub.com",
      "phone": "+1-555-0101",
      "experience_years": 10,
      "bio": "Experienced general practitioner..."
    }
  ]
}
```

---

### 2. Get Doctors by Specialization
**GET** `/doctors/specialization/{specialization}`

**Auth:** ❌ Not required

**Response (200):**
```json
{
  "total": 2,
  "specialization": "Cardiology",
  "doctors": [...]
}
```

---

### 3. Get Specific Doctor
**GET** `/doctors/{doctor_id}`

**Auth:** ❌ Not required

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439017",
  "name": "Dr. Sarah Johnson",
  "specialization": "General Practice",
  "email": "sarah@healhub.com",
  "phone": "+1-555-0101",
  "experience_years": 10,
  "bio": "Experienced general practitioner..."
}
```

---

### 4. Create Doctor (Admin)
**POST** `/doctors`

**Auth:** ✅ Required (Admin only)

**Request:**
```json
{
  "name": "Dr. James Wilson",
  "specialization": "Neurology",
  "email": "james@healhub.com",
  "phone": "+1-555-0104",
  "experience_years": 12,
  "bio": "Specialist in neurological disorders"
}
```

**Response (200):**
```json
{
  "success": true,
  "doctor_id": "507f1f77bcf86cd799439018",
  "message": "Doctor added successfully"
}
```

---

### 5. Update Doctor (Admin)
**PUT** `/doctors/{doctor_id}`

**Auth:** ✅ Required (Admin only)

**Request:**
```json
{
  "experience_years": 13,
  "bio": "Updated bio..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Doctor updated successfully"
}
```

---

### 6. Delete Doctor (Admin)
**DELETE** `/doctors/{doctor_id}`

**Auth:** ✅ Required (Admin only)

**Response (200):**
```json
{
  "success": true,
  "message": "Doctor deleted successfully"
}
```

---

## 📞 Contact Endpoints

### 1. Get Contact Information
**GET** `/contact`

**Auth:** ❌ Not required

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439019",
  "address": "123 Healthcare Avenue, Medical City",
  "phone": "+1-555-0000",
  "email": "admin@healhub.com",
  "business_hours": "Monday - Friday: 9:00 AM - 5:00 PM",
  "emergency_contact": "+1-555-9999"
}
```

---

### 2. Update Contact Information (Admin)
**PUT** `/contact`

**Auth:** ✅ Required (Admin only)

**Request:**
```json
{
  "address": "456 New Avenue, Healthcare City",
  "phone": "+1-555-0001",
  "business_hours": "Monday - Saturday: 8:00 AM - 6:00 PM"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Contact information updated successfully"
}
```

---

## 🌐 Website Content Endpoints

### 1. Get Website Content
**GET** `/content`

**Auth:** ❌ Not required

**Response (200):**
```json
{
  "home_headline": "Welcome to HealHub",
  "home_subheading": "Your AI-Powered Healthcare Platform",
  "about_content": "HealHub is dedicated to...",
  "benefits_title": "Why Choose HealHub?",
  "benefits_list": [
    "AI-Powered Health Consultations",
    "Easy Appointment Booking"
  ],
  "testimonials": [
    {
      "name": "John Doe",
      "text": "Great service!",
      "rating": 5
    }
  ]
}
```

---

### 2. Update Website Content (Admin)
**PUT** `/content`

**Auth:** ✅ Required (Admin only)

**Request:**
```json
{
  "home_headline": "New Headline",
  "benefits_list": ["New Benefit 1", "New Benefit 2"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Website content updated successfully"
}
```

---

## 🛡️ Admin Panel Endpoints

### 1. Get Admin Profile
**GET** `/admin/me`

**Auth:** ✅ Required (Admin only)

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "username": "admin",
  "email": "admin@healhub.com",
  "full_name": "Administrator",
  "is_active": true
}
```

---

### 2. Dashboard Statistics
**GET** `/admin/dashboard/stats`

**Auth:** ✅ Required (Admin only)

**Response (200):**
```json
{
  "users_total": 45,
  "appointments_total": 28,
  "appointments_pending": 8,
  "appointments_confirmed": 12,
  "appointments_completed": 6,
  "appointments_cancelled": 2,
  "chat_sessions_total": 35,
  "faqs_total": 12,
  "doctors_total": 5
}
```

---

### 3. Get Chat History
**GET** `/admin/chat-history?skip=0&limit=20`

**Auth:** ✅ Required (Admin only)

**Response (200):**
```json
{
  "total": 45,
  "skip": 0,
  "limit": 20,
  "chat_sessions": [...]
}
```

---

### 4. Get All Users
**GET** `/admin/users?skip=0&limit=20`

**Auth:** ✅ Required (Admin only)

**Response (200):**
```json
{
  "total": 45,
  "skip": 0,
  "limit": 20,
  "users": [...]
}
```

---

### 5. System Health Check
**GET** `/admin/health`

**Auth:** ✅ Required (Admin only)

**Response (200):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:45:00"
}
```

---

## 🔄 Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

### Pagination
```json
{
  "total": 100,
  "skip": 0,
  "limit": 10,
  "items": [...]
}
```

---

## 📊 Status Codes

- `200`: OK - Request successful
- `201`: Created - Resource created
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Auth required
- `403`: Forbidden - Access denied
- `404`: Not Found - Resource not found
- `500`: Internal Server Error

---

## 🔑 Key Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Emails are case-insensitive
3. Passwords must be minimum 8 characters
4. JWT tokens expire based on `JWT_EXPIRATION_HOURS` setting
5. Admin endpoints require admin role
6. User endpoints require user role or higher

---

**Last Updated**: January 15, 2024
