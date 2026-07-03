import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../lib/constants'

const quickLinks = [
  { to: ROUTES.USER_CHATBOT, label: 'AI Health Chat', desc: 'Get health insights from our AI assistant', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { to: ROUTES.USER_BOOK_APPOINTMENT, label: 'Book Appointment', desc: 'Schedule a visit with our healthcare team', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: ROUTES.USER_MY_APPOINTMENTS, label: 'My Appointments', desc: 'View and manage your appointments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: ROUTES.USER_PROFILE, label: 'My Profile', desc: 'Update your personal information', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Manage your healthcare journey from one place.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <div className="card-hover h-full">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{link.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
