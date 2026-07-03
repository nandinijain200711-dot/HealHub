# HealHub Backend - AI Healthcare Web Application

## 🏥 Overview

HealHub is a production-ready AI Healthcare Web Application backend built with **FastAPI**, **MongoDB**, and **OpenAI API**. It provides comprehensive healthcare services including AI chatbot, appointment booking, and admin panel management.

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.104.1
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT (Python-Jose)
- **AI**: OpenAI API
- **Email**: SMTP
- **Python Version**: 3.9+

## 📋 Features

### 1. **User Authentication**
- User registration and login with JWT tokens
- Admin authentication and role-based access
- Secure password hashing with bcrypt
- Token verification endpoints

### 2. **AI Chatbot**
- Chat sessions with history storage
- OpenAI integration for health insights
- Session-based conversation tracking
- Message summary generation

### 3. **Appointment System**
- Book appointments online
- Automatic Google Meet link generation
- Email confirmations to user and admin
- Appointment status management
- Rescheduling and cancellation

### 4. **Content Management**
- FAQ management with categories
- Doctor profile management
- Contact information management
- Website content management

### 5. **Admin Panel**
- Admin user management
- Dashboard with statistics
- Chat history viewing
- User management
- All content management
- System health checks

### 6. **Security Features**
- CORS protection
- Rate limiting configuration
- Input validation with Pydantic
- Password hashing
- JWT authentication
- Request/response compression with GZIP

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth.py         # Authentication routes
│   │   ├── chatbot.py      # Chatbot routes
│   │   ├── appointments.py # Appointment routes
│   │   ├── content.py      # FAQ, Doctor, Contact routes
│   │   ├── users.py        # User profile routes
│   │   └── admin.py        # Admin panel routes
│   ├── core/               # Core configuration
│   │   ├── config.py       # Settings and configuration
│   │   ├── database.py     # MongoDB connection
│   │   ├── security.py     # JWT and password utilities
│   │   └── __init__.py
│   ├── models/             # MongoDB models (for reference)
│   │   └── __init__.py
│   ├── schemas/            # Pydantic schemas
│   │   ├── schemas.py      # All data schemas
│   │   └── __init__.py
│   ├── services/           # Business logic
│   │   ├── user_service.py        # User operations
│   │   ├── admin_service.py       # Admin operations
│   │   ├── chat_service.py        # Chat operations
│   │   ├── appointment_service.py # Appointment operations
│   │   ├── other_services.py      # FAQ, Doctor, Contact services
│   │   └── __init__.py
│   ├── repositories/       # Database access layer
│   │   ├── base.py         # Repository classes
│   │   └── __init__.py
│   ├── utils/              # Utility functions
│   │   ├── email.py        # Email sending
│   │   ├── openai_helper.py # OpenAI integration
│   │   └── __init__.py
│   └── __init__.py
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🚀 Installation & Setup

### Prerequisites

- Python 3.9 or higher
- MongoDB (local or Atlas)
- OpenAI API key
- Gmail account (for SMTP)

### Step 1: Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# Replace these critical values:
# - MONGODB_URI: Your MongoDB connection string
# - OPENAI_API_KEY: Your OpenAI API key
# - SMTP_USER & SMTP_PASSWORD: Gmail credentials
# - JWT_SECRET_KEY: Generate a secure random key
# - GOOGLE_MEET_LINK: Your Google Meet meeting link
# - ADMIN credentials
```

### Step 3: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Windows
mongod

# Linux/Mac
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Add to .env as MONGODB_URI
```
mongodb+srv://username:password@cluster.mongodb.net/healhub
```

### Step 4: Initialize Admin

The admin credentials are configured in `.env`. On first run:
- Default admin email: `admin@healhub.com`
- Change password in `.env` after first login

## 🏃 Running the Application

### Development Mode

```bash
# With auto-reload
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
# Single worker
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Multiple workers (production)
python -m uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000
```

### Using Gunicorn (Recommended for Production)

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

## 📚 API Documentation

Once running, access the API documentation:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🔐 API Endpoints

### Authentication

```
POST   /api/v1/auth/register              # User registration
POST   /api/v1/auth/login                 # User login
POST   /api/v1/auth/admin/login           # Admin login
POST   /api/v1/auth/verify-token          # Verify JWT token
```

### User Profile

```
GET    /api/v1/users/me                   # Get current user profile
PUT    /api/v1/users/me                   # Update user profile
GET    /api/v1/users/{user_id}            # Get public user profile
```

### Chatbot

```
POST   /api/v1/chatbot/session/create     # Create chat session
GET    /api/v1/chatbot/session/{id}       # Get chat session
GET    /api/v1/chatbot/sessions           # Get all user sessions
POST   /api/v1/chatbot/session/{id}/message  # Send message
GET    /api/v1/chatbot/session/{id}/summary  # Get session summary
DELETE /api/v1/chatbot/session/{id}       # Delete session
```

### Appointments

```
POST   /api/v1/appointments/book          # Book appointment
GET    /api/v1/appointments/{id}          # Get appointment
GET    /api/v1/appointments/user/my-appointments  # My appointments
GET    /api/v1/appointments               # All appointments (admin)
PUT    /api/v1/appointments/{id}          # Update appointment
POST   /api/v1/appointments/{id}/cancel   # Cancel appointment
POST   /api/v1/appointments/{id}/confirm  # Confirm (admin)
POST   /api/v1/appointments/{id}/complete # Complete (admin)
```

### Content Management

```
GET    /api/v1/faqs                       # Get all FAQs
GET    /api/v1/faqs/category/{cat}        # FAQs by category
GET    /api/v1/faqs/{id}                  # Get FAQ
POST   /api/v1/faqs                       # Create FAQ (admin)
PUT    /api/v1/faqs/{id}                  # Update FAQ (admin)
DELETE /api/v1/faqs/{id}                  # Delete FAQ (admin)

GET    /api/v1/doctors                    # Get all doctors
GET    /api/v1/doctors/{id}               # Get doctor
POST   /api/v1/doctors                    # Create doctor (admin)
PUT    /api/v1/doctors/{id}               # Update doctor (admin)
DELETE /api/v1/doctors/{id}               # Delete doctor (admin)

GET    /api/v1/contact                    # Get contact info
PUT    /api/v1/contact                    # Update contact (admin)

GET    /api/v1/content                    # Get website content
PUT    /api/v1/content                    # Update content (admin)
```

### Admin Panel

```
GET    /api/v1/admin/me                   # Get admin profile
GET    /api/v1/admin/admins               # Get all admins
POST   /api/v1/admin/admins               # Create admin
DELETE /api/v1/admin/admins/{id}          # Delete admin
GET    /api/v1/admin/dashboard/stats      # Dashboard stats
GET    /api/v1/admin/chat-history         # Chat history
GET    /api/v1/admin/chat-history/{id}    # Chat details
GET    /api/v1/admin/users                # All users
GET    /api/v1/admin/health               # System health
```

## 🔑 Authentication

All protected endpoints require JWT token in Authorization header:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/users/me
```

## 📧 Email Configuration

### Using Gmail with App Password

1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password
3. Add to `.env`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-character-app-password
   ```

### Using Other Email Providers

Update `.env` with your SMTP settings:
```
SMTP_SERVER=your.smtp.server
SMTP_PORT=587  # or 465 for SSL
SMTP_USER=your-email
SMTP_PASSWORD=your-password
```

## 🤖 OpenAI Integration

1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4 for better results
   ```

### Troubleshooting OpenAI

- Check API key validity
- Verify account has credits
- Check rate limits
- Review API usage dashboard

## 🧪 Testing APIs

### Using cURL

```bash
# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Book appointment
curl -X POST http://localhost:8000/api/v1/appointments/book \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_phone": "1234567890",
    "appointment_date": "2024-01-15",
    "appointment_time": "14:00",
    "reason": "Regular checkup"
  }'
```

### Using Postman

1. Import API from `/api/docs` (Swagger)
2. Set environment variables for base_url and token
3. Test endpoints with different payloads

## 🚨 Error Handling

The API returns standardized error responses:

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **JWT Secret**: Use strong, random 32+ character key
3. **Passwords**: Minimum 8 characters, hash with bcrypt
4. **CORS**: Restrict to frontend domain in production
5. **HTTPS**: Use HTTPS in production
6. **Rate Limiting**: Enable and configure appropriately
7. **MongoDB**: Use connection string with credentials
8. **Admin Credentials**: Change default admin password

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check connection string format
mongodb://username:password@host:port/database

# For MongoDB Atlas
mongodb+srv://username:password@cluster.mongodb.net/database
```

### OpenAI API Errors

- "Invalid API key": Check key format starts with `sk-`
- "Rate limit exceeded": Wait before retrying
- "Invalid model": Verify model name in .env

### Email Not Sending

- Verify SMTP credentials
- Check Gmail app password (not account password)
- Enable "Less secure app access" if using Gmail
- Verify firewall allows port 587 or 465

### Port Already in Use

```bash
# Change port
python -m uvicorn main:app --port 8001

# Or kill process using port 8000
# Windows: netstat -ano | findstr :8000
# Linux/Mac: lsof -i :8000
```

## 📦 Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]
```

### Heroku

```bash
# Create Procfile
echo "web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:\$PORT" > Procfile

# Deploy
git push heroku main
```

### AWS/GCP/Azure

Deploy using containerization and cloud platforms.

## 📝 Database Models

### Collections in MongoDB

- `users`: User accounts
- `admins`: Admin accounts
- `chat_sessions`: Chat history
- `appointments`: Appointment bookings
- `faqs`: FAQ entries
- `doctors`: Doctor profiles
- `contact`: Contact information
- `website_content`: Website content

## 🔄 API Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Error response:

```json
{
  "success": false,
  "error": "Error type",
  "detail": "Detailed error message"
}
```

## 📞 Support & Documentation

- API Docs: `/api/docs` (Swagger UI)
- ReDoc: `/api/redoc`
- Health Check: `/health`

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Important Notes

1. This is a production-ready skeleton - add comprehensive logging and monitoring
2. Set up proper backup strategies for MongoDB
3. Configure SSL/TLS certificates for HTTPS
4. Implement rate limiting middleware
5. Add request/response logging for debugging
6. Set up monitoring and alerting
7. Regular security audits recommended
8. Keep dependencies updated

## 🎯 Next Steps

1. Configure all environment variables
2. Set up MongoDB
3. Run backend server
4. Access API documentation at `/api/docs`
5. Begin frontend development

---

**Happy coding! 🚀**
