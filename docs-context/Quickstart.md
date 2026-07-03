# 🚀 HealHub Backend - Quick Start Guide

## Prerequisites
- Python 3.9+
- MongoDB running locally or MongoDB Atlas account
- OpenAI API key
- Gmail account (for email testing)

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 2. Configure Environment
```bash
# Copy and edit .env file
cp .env.example .env

# Edit .env with your details:
# - MONGODB_URI: Your MongoDB connection string
# - OPENAI_API_KEY: Your OpenAI API key
# - SMTP_USER & SMTP_PASSWORD: Gmail credentials
# - JWT_SECRET_KEY: Random secure key
```

### 3. Initialize Database
```bash
python init_db.py
```

This will:
- Create default admin user
- Add sample FAQs
- Add sample doctors
- Add contact information
- Create database indexes

### 4. Start the Server
```bash
  uvicorn main:app --reload
```

Server runs at: **http://localhost:8000**

## 📚 Access Documentation

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **Health Check**: http://localhost:8000/health

## 🔑 Default Admin Credentials

After running `init_db.py`:
- **Username**: admin
- **Email**: admin@healhub.com
- **Password**: Check your `.env` file (ADMIN_PASSWORD)

## 🧪 Quick API Tests

### 1. User Registration
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Copy the `access_token` from response.

### 3. Get User Profile (with token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/users/me
```

### 4. Book Appointment
```bash
curl -X POST http://localhost:8000/api/v1/appointments/book \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_phone": "1234567890",
    "appointment_date": "2024-02-15",
    "appointment_time": "14:00",
    "reason": "General checkup"
  }'
```

### 5. Create Chat Session
```bash
curl -X POST http://localhost:8000/api/v1/chatbot/session/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "John Doe",
    "user_age": 30,
    "user_gender": "male",
    "initial_symptom": "Headache"
  }'
```

## 📂 Project Structure

```
backend/
├── app/
│   ├── api/              # API routes
│   ├── core/             # Config & database
│   ├── schemas/          # Data validation
│   ├── services/         # Business logic
│   ├── repositories/     # Database access
│   └── utils/            # Helpers
├── main.py               # FastAPI app
├── requirements.txt      # Dependencies
├── .env.example          # Config template
├── init_db.py            # Database setup
└── README.md             # Full documentation
```

## 🔧 Troubleshooting

### MongoDB Connection Failed
```bash
# Check MongoDB is running
# Local: mongod should be running
# Atlas: Check connection string in .env

# Test connection
python -c "import asyncio; from app.core.database import connect_to_mongo; asyncio.run(connect_to_mongo())"
```

### Port 8000 Already in Use
```bash
# Use different port
python -m uvicorn main:app --reload --port 8001
```

### Email Not Sending
- Enable "Less secure app access" on Gmail
- Use app-specific password instead of account password
- Check SMTP credentials in .env

### OpenAI API Error
- Verify API key starts with `sk-`
- Check account has credits
- Verify model name is correct

## 📚 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/register | ❌ | Register user |
| POST | /api/v1/auth/login | ❌ | Login user |
| POST | /api/v1/auth/admin/login | ❌ | Admin login |
| GET | /api/v1/users/me | ✅ | Get profile |
| POST | /api/v1/appointments/book | ✅ | Book appointment |
| POST | /api/v1/chatbot/session/create | ✅ | Create chat |
| GET | /api/v1/faqs | ❌ | Get FAQs |
| GET | /api/v1/contact | ❌ | Get contact |

✅ = Requires authentication
❌ = Public endpoint

## 🚀 Next Steps

1. ✅ Backend setup complete!
2. 📱 Now set up the [frontend](../frontend/README.md)
3. 🗄️ Configure production database
4. 🔐 Set up SSL/TLS certificates
5. 📊 Configure monitoring and logging

## 📞 Need Help?

1. Check `/api/docs` for API documentation
2. Review full [README.md](README.md)
3. Check error messages in console
4. Verify all .env variables are set

## 🎯 Common Tasks

### Add New FAQ
Use Swagger UI at `/api/docs` and call:
```
POST /api/v1/faqs
```

### View Chat History (Admin)
```
GET /api/v1/admin/chat-history
```

### Get Dashboard Stats (Admin)
```
GET /api/v1/admin/dashboard/stats
```

### Update Website Content (Admin)
```
PUT /api/v1/content
```

---

**Ready to go! 🎉**

Access the API docs at: **http://localhost:8000/api/docs**
