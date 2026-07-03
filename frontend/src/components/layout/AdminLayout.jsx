import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../lib/constants'

const links = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.ADMIN_APPOINTMENTS, label: 'Appointments' },
  { to: ROUTES.ADMIN_USERS, label: 'Users' },
  { to: ROUTES.ADMIN_CHAT_HISTORY, label: 'Chat History' },
  { to: ROUTES.ADMIN_DOCTORS, label: 'Doctors' },
  { to: ROUTES.ADMIN_FAQS, label: 'FAQs' },
  { to: ROUTES.ADMIN_CONTENT, label: 'Content' },
  { to: ROUTES.ADMIN_CONTACT, label: 'Contact' },
  { to: ROUTES.ADMIN_ADMINS, label: 'Admins' },
  { to: ROUTES.ADMIN_HEALTH, label: 'Health' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-primary-400">HealHub</h1>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.ADMIN_DASHBOARD}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
          <p className="text-xs text-gray-500 px-3">{user?.email}</p>
          <button onClick={logout} className="block w-full text-left px-3 py-2.5 text-sm text-gray-400 hover:text-white">
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">Welcome, {user?.full_name || user?.name}</span>
          <NavLink to="/" className="text-sm text-primary-600 hover:underline">Back to Site</NavLink>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
