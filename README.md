# HealHub

## AI-Powered Healthcare Platform

HealHub is a full-stack healthcare web application built with a React + Vite frontend and a FastAPI backend. It combines user-facing appointment booking, an AI-powered health chatbot, and an admin management dashboard with MongoDB data persistence and JWT authentication.

---

## Project Overview

HealHub delivers a modern healthcare experience with support for patient registration, AI-assisted health guidance, appointment booking, and content management. Admins can manage doctors, FAQs, website content, contact information, and appointment status through a dedicated dashboard.

---

## Features

- User registration and login
- Admin login and role-based access
- AI health chatbot powered by Google Gemini API
- Appointment booking, confirmation, cancellation, and completion
- Doctor profile management
- FAQ content management
- Website content management
- Contact information management
- User dashboard with appointment history
- Admin dashboard with system and user management

---

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI
- Database: MongoDB
- Authentication: JWT
- AI: Google Gemini API
- Email: SMTP
- Deployment-ready tooling: Uvicorn

---

## Folder Structure

```
HealHub/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/            # API route definitions
│   │   ├── core/           # configuration, database, security
│   │   ├── repositories/    # data access layer
│   │   ├── schemas/         # Pydantic request/response models
│   │   ├── services/        # business logic
│   │   └── utils/           # utility helpers
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # environment variable template
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── docs-context/           # project documentation and summaries
```

---

## Installation Steps

### Prerequisites

- Node.js and npm
- Python 3.9+ or newer
- MongoDB instance (local or Atlas)
- Google Gemini API key
- SMTP credentials for email notifications

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/HealHub.git
cd HealHub
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

---

## Environment Variables

### Backend `.env`

Copy and update `backend/.env.example` to `backend/.env`.

Required values:

- `GEMINI_API_KEY`
- `MONGODB_URI`
- `DATABASE_NAME`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `JWT_EXPIRATION_HOURS`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SMTP_SERVER`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SENDER_EMAIL`
- `SENDER_NAME`
- `GOOGLE_MEET_LINK`
- `FRONTEND_URL`
- `BACKEND_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_USERNAME`
- `ALLOWED_HOSTS`
- `CORS_ORIGINS`
- `RATE_LIMIT_ENABLED`
- `RATE_LIMIT_REQUESTS`
- `RATE_LIMIT_PERIOD`

### Frontend `.env` (optional)

If your frontend application uses environment variables, create a `.env` file in `frontend/` and define values such as:

- `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- `VITE_APP_NAME=HealHub`

> Note: The frontend currently uses the backend base URL from the backend config and may not require a separate `.env` by default.

---

## Backend Setup

1. Activate the backend virtual environment:

```bash
cd backend
venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create `.env` from `.env.example` and provide your configuration values.

4. Start the backend server:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`.

---

## Frontend Setup

1. Install packages:

```bash
cd frontend
npm install
```

2. Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` by default.

---

## Running Locally

Start both the backend and frontend servers in separate terminals:

```bash
# Terminal 1
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser to use HealHub.

---

## API Overview

The backend exposes a REST API under `/api/v1`.

Key endpoint groups:

- `/api/v1/auth` - user and admin authentication
- `/api/v1/users` - user profile and account actions
- `/api/v1/chatbot` - AI health chatbot sessions and messages
- `/api/v1/appointments` - appointment booking and management
- `/api/v1/faqs` - FAQ content management
- `/api/v1/doctors` - doctor profiles management
- `/api/v1/contact` - contact information
- `/api/v1/content` - website content
- `/api/v1/admin` - admin dashboard and system health

For detailed API documentation, refer to `docs-context/API_Documentation.md` or use the built-in FastAPI docs at:

- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

---

## Admin Credentials

The admin account is configured through backend environment variables.

Default example credentials:

- Email: `admin@healhub.com`
- Username: `admin`
- Password: `AdminPassword123!`

> Important: Change the default admin password and credentials before deploying to production.

---

## Future Improvements

- Add role-based access control for finer permissions
- Implement real-time chat with WebSockets
- Add appointment calendar integration
- Add file uploads for medical records
- Add internationalization (i18n) support
- Improve user activity analytics
- Add automated tests for frontend and backend
- Deploy with Docker and Kubernetes

---

## License

This project is released under the MIT License.
