# 📋 HealHub Backend - Project Structure & File Guide

## 📁 Complete Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py                 # Authentication (register, login, JWT)
│   │   ├── chatbot.py              # AI chatbot endpoints
│   │   ├── appointments.py         # Appointment booking endpoints
│   │   ├── content.py              # FAQ, Doctor, Contact endpoints
│   │   ├── users.py                # User profile endpoints
│   │   └── admin.py                # Admin panel endpoints
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py               # Settings & environment configuration
│   │   ├── database.py             # MongoDB connection management
│   │   └── security.py             # JWT & password utilities
│   │
│   ├── models/
│   │   └── __init__.py             # MongoDB models (reference only)
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── schemas.py              # Pydantic data validation schemas
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── user_service.py         # User business logic
│   │   ├── admin_service.py        # Admin business logic
│   │   ├── chat_service.py         # Chatbot business logic
│   │   ├── appointment_service.py  # Appointment business logic
│   │   └── other_services.py       # FAQ, Doctor, Contact services
│   │
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── base.py                 # Database access layer (all repositories)
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── email.py                # Email sending utilities
│   │   └── openai_helper.py        # OpenAI API integration
│   │
│   └── __init__.py
│
├── main.py                         # FastAPI application entry point
├── init_db.py                      # Database initialization script
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment variables template
│
├── README.md                       # Comprehensive documentation
├── QUICKSTART.md                   # 5-minute quick start guide
├── API_DOCUMENTATION.md            # Complete API endpoint documentation
├── DEPLOYMENT.md                   # Production deployment guide
└── PROJECT_STRUCTURE.md            # This file
```

---

## 📄 File Descriptions

### Core Application Files

#### `main.py` (Entry Point)
- FastAPI application initialization
- Middleware setup (CORS, GZIP, exception handling)
- Route registration
- Startup/shutdown events
- Health check endpoints

#### `requirements.txt` (Dependencies)
- All Python package dependencies
- Specific versions for reproducibility
- Includes: FastAPI, MongoDB, OpenAI, JWT, Email, etc.

#### `.env.example` (Configuration Template)
- Template for environment variables
- All required settings documented
- Instructions for each configuration

#### `init_db.py` (Database Setup)
- Creates default admin user
- Inserts sample FAQs
- Creates sample doctors
- Initializes contact information
- Sets up database indexes
- Run once on first deployment

---

### API Routes (`app/api/`)

#### `auth.py` (Authentication)
- User registration endpoint
- User login endpoint
- Admin login endpoint
- JWT token verification
- Authentication dependency functions

**Key Functions:**
- `register`: User account creation
- `login`: User authentication
- `admin_login`: Admin authentication
- `get_current_user`: Dependency for user routes
- `get_current_admin`: Dependency for admin routes

#### `chatbot.py` (AI Chatbot)
- Create chat sessions
- Get chat history
- Send messages and get AI responses
- Generate session summaries
- Delete sessions

**Key Functions:**
- `create_chat_session`: Start new chat
- `send_message`: Chat with AI
- `get_session_summary`: Get summary

#### `appointments.py` (Appointment Booking)
- Book appointments
- View appointments
- Update appointments
- Cancel appointments
- Admin status management

**Key Functions:**
- `book_appointment`: Create new appointment
- `get_my_appointments`: User's appointments
- `get_all_appointments`: Admin view
- `cancel_appointment`: Cancel booking

#### `content.py` (Content Management)
- FAQ CRUD operations
- Doctor management
- Contact information
- Website content management

**Key Functions:**
- FAQ: create, read, update, delete, filter by category
- Doctor: create, read, update, delete, filter by specialization
- Contact: get, update
- Content: get, update

#### `users.py` (User Profile)
- Get current user profile
- Update user profile
- Get public user profile

**Key Functions:**
- `get_current_user_profile`: Current user data
- `update_user_profile`: Profile updates
- `get_user_profile`: Public profile view

#### `admin.py` (Admin Panel)
- Admin user management
- Dashboard statistics
- Chat history viewing
- User management
- System health checks

**Key Functions:**
- `get_admin_profile`: Admin info
- `get_dashboard_stats`: Statistics overview
- `get_chat_history`: View all chat sessions
- `get_all_users`: User management

---

### Configuration (`app/core/`)

#### `config.py` (Settings)
- Pydantic settings model
- All configuration variables
- Loads from `.env` file
- Provides settings object used throughout app

**Key Configs:**
- Database connection
- JWT settings
- OpenAI settings
- Email settings
- Google Meet link
- CORS settings

#### `database.py` (Database Connection)
- MongoDB async connection management
- Connection lifecycle (connect/disconnect)
- Database and collection access functions
- Connection pooling

**Key Functions:**
- `connect_to_mongo()`: Establish connection
- `close_mongo_connection()`: Close connection
- `get_database()`: Get database instance
- `get_collection()`: Get specific collection

#### `security.py` (Security Utilities)
- JWT token creation and verification
- Password hashing with bcrypt
- Token payload management

**Key Functions:**
- `create_access_token()`: Create JWT
- `verify_token()`: Validate JWT
- `hash_password()`: Hash passwords
- `verify_password()`: Verify passwords

---

### Data Schemas (`app/schemas/`)

#### `schemas.py` (Pydantic Models)
- User schemas (register, login, update)
- Admin schemas
- Chat schemas
- Appointment schemas
- FAQ schemas
- Doctor schemas
- Contact schemas
- Website content schemas
- Auth schemas

**Schema Categories:**
- User: `UserCreate`, `User`, `UserInDB`, etc.
- Admin: `AdminCreate`, `Admin`, `AdminInDB`
- Chat: `ChatSession`, `ChatMessage`, `ChatMessageRequest`
- Appointment: `AppointmentCreate`, `Appointment`, `AppointmentUpdate`
- FAQ: `FAQCreate`, `FAQ`, `FAQUpdate`
- Doctor: `DoctorCreate`, `Doctor`, `DoctorUpdate`
- Contact: `ContactBase`, `Contact`, `ContactUpdate`
- Auth: `TokenResponse`, `TokenData`, `LoginRequest`

---

### Services (`app/services/`)

#### `user_service.py` (User Logic)
- User registration with validation
- User authentication
- Profile retrieval
- Profile updates

**Key Methods:**
- `register_user()`: Create user account
- `authenticate_user()`: Validate credentials
- `get_user()`: Retrieve user data
- `update_user_profile()`: Update profile

#### `admin_service.py` (Admin Logic)
- Admin creation
- Admin authentication
- Admin management (CRUD)

**Key Methods:**
- `create_admin()`: Create admin account
- `authenticate_admin()`: Validate admin
- `get_admin()`: Get admin data
- `delete_admin()`: Remove admin

#### `chat_service.py` (Chat Logic)
- Chat session management
- Message handling
- AI response generation
- Session summarization

**Key Methods:**
- `create_chat_session()`: Start conversation
- `add_user_message()`: Store user input
- `get_ai_response()`: Get OpenAI response
- `get_session_summary()`: Generate summary

#### `appointment_service.py` (Appointment Logic)
- Appointment booking
- Appointment management
- Status updates
- Email notifications

**Key Methods:**
- `create_appointment()`: Book appointment
- `cancel_appointment()`: Cancel booking
- `confirm_appointment()`: Confirm booking
- `complete_appointment()`: Mark complete

#### `other_services.py` (Content Logic)
- FAQ management
- Doctor management
- Contact management
- Website content management

**Key Services:**
- `FAQService`: FAQ CRUD
- `DoctorService`: Doctor CRUD
- `ContactService`: Contact management
- `WebsiteContentService`: Content updates

---

### Repositories (`app/repositories/`)

#### `base.py` (Database Access)
- Base repository class with common operations
- Specific repositories for each entity

**Base Methods:**
- `create()`, `get_by_id()`, `update()`, `delete()`
- `get_all()`, `count()`, `exists()`

**Specific Repositories:**
- `UserRepository`: User DB operations
- `AdminRepository`: Admin DB operations
- `ChatSessionRepository`: Chat DB operations
- `AppointmentRepository`: Appointment DB operations
- `FAQRepository`: FAQ DB operations
- `DoctorRepository`: Doctor DB operations
- `ContactRepository`: Contact DB operations
- `WebsiteContentRepository`: Content DB operations

---

### Utilities (`app/utils/`)

#### `email.py` (Email Service)
- Async email sending
- Appointment confirmation emails
- Welcome emails
- HTML email templates

**Key Functions:**
- `send_email()`: Generic email sender
- `send_appointment_confirmation()`: Appointment emails
- `send_welcome_email()`: Welcome emails

#### `openai_helper.py` (OpenAI Integration)
- AI health insights generation
- Chat history summarization
- OpenAI API calls

**Key Functions:**
- `get_ai_health_insights()`: Get health advice
- `generate_health_summary()`: Summarize chat

---

### Documentation Files

#### `README.md` (Main Documentation)
- Complete project overview
- Installation instructions
- API endpoint summary
- Configuration guide
- Troubleshooting section
- Deployment information

#### `QUICKSTART.md` (Quick Start)
- 5-minute setup guide
- Common API tests
- Quick troubleshooting
- Key endpoints summary

#### `API_DOCUMENTATION.md` (API Reference)
- All endpoints with examples
- Request/response formats
- Authentication details
- Status codes
- Common patterns

#### `DEPLOYMENT.md` (Deployment Guide)
- VPS deployment
- Docker deployment
- Heroku deployment
- AWS Lambda setup
- Security hardening
- Database backups
- Monitoring setup

---

## 🏗️ Architecture Patterns

### Layered Architecture
```
┌─────────────────────┐
│   API Routes        │ (app/api/)
│ (FastAPI Endpoints) │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ Services            │ (app/services/)
│ (Business Logic)    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ Repositories        │ (app/repositories/)
│ (Data Access)       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ MongoDB             │
│ (Database)          │
└─────────────────────┘
```

### Database Collections
- `users`: User accounts
- `admins`: Admin accounts
- `chat_sessions`: Chat conversations
- `appointments`: Appointment bookings
- `faqs`: Frequently asked questions
- `doctors`: Doctor profiles
- `contact`: Contact information
- `website_content`: Website content

---

## 🔄 Data Flow Examples

### User Registration Flow
1. API receives POST `/auth/register`
2. `auth.py` validates input using `UserCreate` schema
3. Calls `UserService.register_user()`
4. Service checks for existing user via `UserRepository`
5. Creates new user with hashed password
6. Returns JWT token

### Appointment Booking Flow
1. API receives POST `/appointments/book`
2. Validates using `AppointmentCreate` schema
3. `AppointmentService.create_appointment()` called
4. Repository stores appointment in MongoDB
5. `email.py` sends confirmation emails
6. Returns appointment ID and Google Meet link

### Chat Interaction Flow
1. API receives POST `/chatbot/session/{id}/message`
2. Message stored in chat session via `ChatService`
3. `openai_helper.py` calls OpenAI API
4. AI response stored in MongoDB
5. Response returned to user

---

## 🔐 Security Layers

1. **Authentication**: JWT tokens in `security.py`
2. **Authorization**: Role-based access in API routes
3. **Input Validation**: Pydantic schemas in `schemas.py`
4. **Password Security**: Bcrypt hashing in `security.py`
5. **CORS Protection**: Configured in `main.py`
6. **HTTPS**: Enforced via Nginx in production
7. **Rate Limiting**: Configured in `config.py`

---

## 📊 Database Design

### Collections
Each collection has:
- `_id`: MongoDB ObjectId (primary key)
- `created_at`: Timestamp (UTC)
- `updated_at`: Timestamp (UTC)
- Indexes on frequently queried fields

### Key Relationships
- Users → Chat Sessions (1-to-many)
- Users → Appointments (1-to-many)
- Appointments → Google Meet link (1-to-1)
- Chat Sessions → Messages (array)

---

## 🚀 Performance Features

1. **Async Operations**: Motor for non-blocking DB access
2. **Compression**: GZIP middleware for response compression
3. **Indexing**: Database indexes for fast queries
4. **Pagination**: Limit/offset for large datasets
5. **Caching**: Headers support for client-side caching

---

## 🧪 Testing the Backend

### Manual Testing
1. Use Swagger UI at `/api/docs`
2. Use cURL or Postman
3. Check API_DOCUMENTATION.md for examples

### Automated Testing (Future Enhancement)
- Add pytest
- Create test files for each module
- Use test database
- Mock external services (OpenAI, SMTP)

---

## 📈 Extension Points

### Adding New Endpoint
1. Create route in `app/api/`
2. Create service in `app/services/`
3. Create repository in `app/repositories/base.py`
4. Define schema in `app/schemas/schemas.py`
5. Include router in `main.py`

### Adding New Feature
1. Define data model/schema
2. Create MongoDB collection with indexes
3. Create repository methods
4. Create service business logic
5. Create API endpoints
6. Write documentation

---

## 📞 Support Matrix

| Component | Purpose | Status |
|-----------|---------|--------|
| FastAPI | Web framework | ✅ Production Ready |
| MongoDB | Database | ✅ Production Ready |
| OpenAI | AI service | ✅ Production Ready |
| JWT | Authentication | ✅ Production Ready |
| SMTP | Email service | ✅ Production Ready |
| Gunicorn | WSGI server | ✅ Production Ready |
| Nginx | Reverse proxy | ✅ Production Ready |

---

## 🎯 Next Steps

1. **Setup Backend**: Follow QUICKSTART.md
2. **Configure .env**: Set all required variables
3. **Initialize Database**: Run init_db.py
4. **Test APIs**: Use Swagger UI at /api/docs
5. **Build Frontend**: Start with frontend setup
6. **Deploy**: Follow DEPLOYMENT.md

---

## 📞 Quick Reference

- **Start Server**: `python -m uvicorn main:app --reload`
- **Init Database**: `python init_db.py`
- **API Docs**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/health
- **Configuration**: Edit `.env` file

---

**Project Structure Complete! 🎉**

All files are production-ready and fully documented.
Start with QUICKSTART.md for immediate setup.
