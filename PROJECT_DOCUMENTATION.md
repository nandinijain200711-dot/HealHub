# HealHub Project Documentation

## 1. System Architecture

HealHub is a modular, full-stack healthcare platform consisting of a React frontend and a FastAPI backend connected to MongoDB. The system is designed in three main layers:

- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI application with route, service, and repository layers
- Database: MongoDB collections for users, admins, chat sessions, appointments, FAQs, doctors, contact, and website content

The architecture follows a layered design:

1. Client browser interacts with React UI
2. React calls backend APIs exposed under `/api/v1`
3. FastAPI controllers validate request payloads with Pydantic schemas
4. Services implement business logic and orchestrate repository access
5. Repositories perform MongoDB data operations
6. Backend returns JSON responses and JWT tokens to the frontend

### System Components

- `frontend/` — user interface, routing, authentication, pages for public, user, and admin flows
- `backend/main.py` — entrypoint for the FastAPI application
- `backend/app/api/` — API route modules
- `backend/app/services/` — business logic modules
- `backend/app/repositories/` — data access layer
- `backend/app/schemas/` — request/response models and validation
- `backend/app/core/` — configuration, database connection, security utilities

---

## 2. Frontend Flow

The frontend is structured into three main views: Public, User, and Admin.

### Public Flow

Available routes:

- `/` — Home
- `/about` — About page
- `/faq` — FAQ page
- `/doctors` — Doctors list
- `/contact` — Contact page
- `/login` — User login
- `/register` — User registration

These pages are rendered within `PublicLayout` and do not require authentication.

### User Flow

Authenticated users access protected routes through `ProtectedRoute`:

- `/dashboard` — User dashboard
- `/profile` — View profile
- `/profile/edit` — Edit profile
- `/chatbot` — AI health chatbot
- `/chatbot/history` — Chat session history
- `/appointments` — User appointments
- `/appointments/book` — Appointment booking

The user flow begins with login or registration, stores JWT tokens in local storage, and uses Axios interceptors to attach the token to backend requests.

### Admin Flow

Authenticated admin users access the admin interface through `AdminRoute`:

- `/admin` — Admin dashboard
- `/admin/appointments` — Appointment management
- `/admin/users` — User management
- `/admin/chat-history` — Chat history audit
- `/admin/doctors` — Doctor management
- `/admin/faqs` — FAQ management
- `/admin/content` — Website content management
- `/admin/contact` — Contact information management
- `/admin/admins` — Admin user management
- `/admin/health` — System health checks

Admin routes are separated from public and user routes to enforce privilege separation.

---

## 3. Backend Flow

The backend receives requests at `/api/v1/*` and routes them through FastAPI APIRouters.

### Request lifecycle

1. Request enters FastAPI in `backend/main.py`
2. Middleware applies CORS and gzip compression
3. Route handler in `app/api/` validates incoming payloads with Pydantic schemas
4. Auth dependencies check JWT tokens when required
5. Service layer executes business rules
6. Repository layer performs MongoDB CRUD operations
7. Controller returns response to the client

### Route modules

- `auth.py` — user registration, login, admin login, token verification
- `users.py` — user profile retrieval and update
- `chatbot.py` — chat session creation, message exchange, session summary, deletion
- `appointments.py` — booking, retrieval, update, cancellation, admin status changes
- `content.py` — FAQ, doctor, contact, website content management
- `admin.py` — admin profile, admin management, dashboard stats, chat and user audit, health checks

---

## 4. Database Collections

HealHub stores data in MongoDB using the following collections:

### `users`
- `_id`
- `name`
- `email`
- `phone`
- `age`
- `gender`
- `hashed_password`
- `created_at`
- `updated_at`

### `admins`
- `_id`
- `username`
- `email`
- `full_name`
- `hashed_password`
- `is_active`
- `created_at`
- `updated_at`

### `chat_sessions`
- `_id`
- `user_email`
- `user_name`
- `user_age`
- `user_gender`
- `initial_symptom`
- `messages` (array of roles and content)
- `ai_insights`
- `summary`
- `created_at`
- `updated_at`

### `appointments`
- `_id`
- `user_name`
- `user_email`
- `user_phone`
- `appointment_date`
- `appointment_time`
- `reason`
- `status` (`pending`, `confirmed`, `completed`, `cancelled`)
- `meet_link`
- `notes`
- `created_at`
- `updated_at`

### `faqs`
- `_id`
- `question`
- `answer`
- `category`
- `order`
- `created_at`
- `updated_at`

### `doctors`
- `_id`
- `name`
- `specialization`
- `email`
- `phone`
- `experience_years`
- `bio`
- `created_at`
- `updated_at`

### `contact`
- `_id`
- `address`
- `phone`
- `email`
- `business_hours`
- `emergency_contact`
- `created_at`
- `updated_at`

### `website_content`
- `_id`
- `home_headline`
- `home_subheading`
- `about_content`
- `benefits_title`
- `benefits_list`
- `testimonials`
- `updated_at`

---

## 5. Authentication Flow

Authentication is handled with JWTs and separated for users and admins.

### User authentication

1. User submits email and password to `POST /api/v1/auth/login`
2. Backend verifies credentials using `UserService` and `UserRepository`
3. FastAPI generates a JWT token with payload fields `user_id`, `email`, and `role: user`
4. Frontend stores the token and user profile locally
5. Protected user endpoints use `get_current_user` dependency to verify token and role

### Admin authentication

1. Admin submits username and password to `POST /api/v1/auth/admin/login`
2. Backend verifies credentials using `AdminService` and `AdminRepository`
3. Server issues a JWT token with `role: admin`
4. Admin endpoints use `get_current_admin` dependency to enforce admin access only

### Token verification

- `POST /api/v1/auth/verify-token` validates the bearer token and returns decoded payload

### Security utilities

- `backend/app/core/security.py` contains password hashing and JWT creation/verification logic
- `backend/app/core/config.py` loads environment variables and secret keys

---

## 6. Appointment Workflow

Appointment management consists of user booking and admin approval.

### Booking

1. User fills appointment form in the frontend
2. Frontend sends request to `POST /api/v1/appointments/book`
3. Backend validates that `user_email` matches the authenticated user
4. `AppointmentService` persists appointment with `status = pending`
5. A confirmation response is returned to the user

### User operations

- `GET /api/v1/appointments/user/my-appointments` — retrieve own appointments
- `GET /api/v1/appointments/{appointment_id}` — view appointment details
- `PUT /api/v1/appointments/{appointment_id}` — edit appointment if owner
- `POST /api/v1/appointments/{appointment_id}/cancel` — cancel as owner

### Admin operations

- `GET /api/v1/appointments` — list all appointments
- `POST /api/v1/appointments/{appointment_id}/confirm` — mark appointment confirmed
- `POST /api/v1/appointments/{appointment_id}/complete` — mark appointment completed

### Status lifecycle

- `pending` → `confirmed` → `completed`
- `pending` or `confirmed` → `cancelled`

---

## 7. AI Chatbot Workflow

The AI chatbot enables health conversations and session persistence.

### Chat session creation

1. User starts a session on `/chatbot`
2. Frontend calls `POST /api/v1/chatbot/session/create`
3. Backend creates a new session document with initial user metadata

### Message exchange

1. User posts a chat message to `POST /api/v1/chatbot/session/{session_id}/message`
2. Backend appends the user message to `messages`
3. `ChatService` sends user details and request context to the AI helper
4. The AI helper returns health insights and a disclaimer
5. Backend saves assistant response as a second message
6. Response is returned to the frontend

### Session management

- `GET /api/v1/chatbot/session/{session_id}` — load session details
- `GET /api/v1/chatbot/sessions` — list user sessions
- `GET /api/v1/chatbot/session/{session_id}/summary` — retrieve session summary
- `DELETE /api/v1/chatbot/session/{session_id}` — remove session

### AI integration

- Backend uses `backend/app/utils/openai_helper.py` for AI calls
- AI payload includes user demographics and reported symptoms
- The system stores `ai_insights` and summary data alongside conversation history

---

## 8. Admin Module Explanation

The admin module provides a management interface for application data and health monitoring.

### Admin management

- `GET /api/v1/admin/me` — retrieve current admin details
- `GET /api/v1/admin/admins` — list all admins
- `POST /api/v1/admin/admins` — create a new admin user
- `DELETE /api/v1/admin/admins/{admin_id}` — delete an admin (self-deletion prevented)

### Dashboard statistics

`GET /api/v1/admin/dashboard/stats` returns:

- total users
- total appointments
- appointment counts by status
- total chat sessions
- total FAQs
- total doctors

### Chat history and user audit

- `GET /api/v1/admin/chat-history` — paginated chat session list
- `GET /api/v1/admin/chat-history/{session_id}` — detailed session transcript
- `GET /api/v1/admin/users` — paginated user list

### System health

- `GET /api/v1/admin/health` — checks MongoDB connection and returns health status

### Admin UI pages

Admin pages are available under `/admin/*` and support appointment, content, doctor, FAQ, contact, chat history, user, and admin management.

---

## 9. API Module Explanation

The API is segmented by domain-specific routers with clear responsibility separation.

### Authentication router (`auth.py`)

- Register and login for users
- Admin login
- Token verification
- JWT dependencies for protected routes

### User router (`users.py`)

- Retrieve and update authenticated user profile
- Public user lookup by ID

### Chatbot router (`chatbot.py`)

- Session creation and retrieval
- Message send/receive processing
- Session summary and deletion

### Appointments router (`appointments.py`)

- User appointment booking and retrieval
- Appointment update and cancellation
- Admin-only listing, confirmation, and completion

### Content router (`content.py`)

- FAQ reading and management
- Doctor profile CRUD
- Contact information management
- Website content retrieval and update

### Admin router (`admin.py`)

- Admin identity and management
- Dashboard metrics
- Chat history audit
- User listing
- System health checks

---

## 10. Known Issues

- `RATE_LIMIT_*` settings exist in configuration but rate limiting middleware is not implemented in `backend/main.py`.
- Website content update endpoint accepts a generic `dict`, which reduces schema validation for frontend payloads.
- AI workflow depends on external Gemini/OpenAI connectivity and may fail if the third-party API is unavailable or invalid keys are provided.
- `GET /api/v1/appointments/{id}` currently allows admin access through token role validation in the user route, but the ownership check may not fully distinguish admin vs user in some edge cases.
- No automated integration tests are included with the repository.
- The frontend currently stores JWT tokens in local storage, which is less secure than HttpOnly cookies.

---

## 11. Future Enhancements

- Implement rate limiting and request throttling middleware
- Add role-based access control with fine-grained permissions
- Add real-time chat using WebSockets or server-sent events
- Add calendar integrations and notifications for appointments
- Add audit logging for admin actions and security-sensitive operations
- Add file upload support for medical records and reports
- Add automated tests for frontend and backend endpoints
- Harden security with HttpOnly cookies and refresh token support
- Add Docker deployment and infrastructure automation
- Improve AI workflow with prompt engineering and fallback handling

---

## 12. Document References

- Backend source: `backend/main.py`, `backend/app/api/`, `backend/app/services/`, `backend/app/repositories/`, `backend/app/schemas/`
- Frontend source: `frontend/src/router/index.jsx`, `frontend/src/contexts/AuthContext.jsx`, `frontend/src/services/api.js`, `frontend/src/services/authService.js`
- Environment config: `backend/.env.example`, `backend/app/core/config.py`
