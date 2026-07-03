import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import PublicLayout from '../components/layout/PublicLayout'
import UserLayout from '../components/layout/UserLayout'
import AdminLayout from '../components/layout/AdminLayout'

import Home from '../pages/public/Home'
import About from '../pages/public/About'
import FAQ from '../pages/public/FAQ'
import Doctors from '../pages/public/Doctors'
import Contact from '../pages/public/Contact'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'

import UserDashboard from '../pages/user/Dashboard'
import Profile from '../pages/user/Profile'
import EditProfile from '../pages/user/EditProfile'
import Chatbot from '../pages/user/Chatbot'
import ChatHistory from '../pages/user/ChatHistory'
import MyAppointments from '../pages/user/MyAppointments'
import BookAppointment from '../pages/user/BookAppointment'

import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageAppointments from '../pages/admin/ManageAppointments'
import ManageUsers from '../pages/admin/ManageUsers'
import AdminChatHistory from '../pages/admin/AdminChatHistory'
import ManageDoctors from '../pages/admin/ManageDoctors'
import ManageFAQs from '../pages/admin/ManageFAQs'
import ManageContent from '../pages/admin/ManageContent'
import ManageContact from '../pages/admin/ManageContact'
import ManageAdmins from '../pages/admin/ManageAdmins'
import SystemHealth from '../pages/admin/SystemHealth'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'doctors', element: <Doctors /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'profile', element: <Profile /> },
      { path: 'profile/edit', element: <EditProfile /> },
      { path: 'chatbot', element: <Chatbot /> },
      { path: 'chatbot/history', element: <ChatHistory /> },
      { path: 'appointments', element: <MyAppointments /> },
      { path: 'appointments/book', element: <BookAppointment /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'appointments', element: <ManageAppointments /> },
      { path: 'users', element: <ManageUsers /> },
      { path: 'chat-history', element: <AdminChatHistory /> },
      { path: 'doctors', element: <ManageDoctors /> },
      { path: 'faqs', element: <ManageFAQs /> },
      { path: 'content', element: <ManageContent /> },
      { path: 'contact', element: <ManageContact /> },
      { path: 'admins', element: <ManageAdmins /> },
      { path: 'health', element: <SystemHealth /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
