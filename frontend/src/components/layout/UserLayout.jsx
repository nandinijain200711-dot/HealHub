import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../lib/constants'

export default function UserLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary-600">HealHub</Link>
            <nav className="hidden md:flex items-center space-x-4">
              <Link to={ROUTES.USER_DASHBOARD} className="text-sm text-gray-600 hover:text-primary-600">Dashboard</Link>
              <Link to={ROUTES.USER_CHATBOT} className="text-sm text-gray-600 hover:text-primary-600">Chatbot</Link>
              <Link to={ROUTES.USER_MY_APPOINTMENTS} className="text-sm text-gray-600 hover:text-primary-600">Appointments</Link>
              <Link to={ROUTES.USER_PROFILE} className="text-sm text-gray-600 hover:text-primary-600">Profile</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{user?.name}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:text-red-700">Logout</button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
