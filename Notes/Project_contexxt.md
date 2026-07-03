# HealHub - AI Healthcare Platform

## Project Overview

HealHub is a modern AI-powered healthcare web application.

The platform allows users to:

- Register and login
- Manage their profile
- Book doctor appointments
- Chat with an AI healthcare assistant
- View doctors
- Read FAQs
- Contact healthcare support

The platform also includes an Admin Dashboard for managing users, doctors, appointments, FAQs and website content.

---

## Tech Stack

Frontend:
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API

Backend:
- FastAPI
- MongoDB Atlas
- JWT Authentication
- Gemini AI

---

## Design Requirements

Style:
- Premium Healthcare SaaS
- Modern
- Clean
- Professional
- Minimal

Colors:
- Primary: #2563EB
- Secondary: #14B8A6
- Accent: #0EA5E9
- Background: #F8FAFC

Typography:
- Modern
- Clean
- High readability

Animations:
- Smooth transitions
- Hover effects
- Scroll animations
- Professional micro interactions

---

## Public Pages

### Home

Sections:

- Navbar
- Hero
- Features
- Benefits
- Doctors
- Testimonials
- FAQ
- Contact
- Footer

---

### About

Company information

Mission

Vision

Healthcare goals

---

### Doctors

Doctor cards

Specialization

Experience

Availability

---

### FAQ

Accordion layout

Search functionality

---

### Contact

Contact form

Contact details

Map section

---

## Authentication

Pages:

- Login
- Register

Features:

- JWT authentication
- Form validation
- Error handling
- Protected routes

---

## User Dashboard

Pages:

### Dashboard

Quick stats

Upcoming appointments

Recent activity

---

### Profile

View profile

Edit profile

---

### Appointments

Book appointment

View appointments

Cancel appointment

---

### AI Chatbot

Healthcare AI assistant

Conversation history

Chat interface similar to ChatGPT

---

## Admin Dashboard

Pages:

### Dashboard

Statistics cards

Charts

Recent activity

---

### Users

View users

Search users

Manage users

---

### Doctors

Add doctor

Edit doctor

Delete doctor

---

### Appointments

Manage appointments

Update status

---

### FAQs

CRUD functionality

---

### Content Management

Homepage content management

Contact information management

---

## Backend API

Base URL:

http://localhost:8000/api/v1

Authentication:
POST /auth/register
POST /auth/login

Users:
GET /users/me
PUT /users/me

Appointments:
POST /appointments/book
GET /appointments/user/my-appointments

Chatbot:
POST /chatbot/session/create
POST /chatbot/session/{session_id}/message

Content:
GET /content
GET /contact
GET /faqs
GET /doctors

Admin:
POST /auth/admin/login
GET /admin/dashboard/stats

---

## Folder Structure

src/
|
├── components/
├── pages/
├── styles/
├── routes/
├── services/
├── App.css
├── hooks/
├── assets/
├── main.jsx
├── main.css
└── App.jsx

---

## Important

Use real API integration.

Do not use mock data.

Do not use placeholder pages.

Create a production-ready frontend.

All pages must be responsive.

All forms must have validation.

Code should be clean and modular.