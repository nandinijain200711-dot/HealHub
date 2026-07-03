import { Outlet, Link } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">HealHub</Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-primary-600">Home</Link>
            <Link to="/about" className="text-sm text-gray-600 hover:text-primary-600">About</Link>
            <Link to="/doctors" className="text-sm text-gray-600 hover:text-primary-600">Doctors</Link>
            <Link to="/faq" className="text-sm text-gray-600 hover:text-primary-600">FAQ</Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-primary-600">Contact</Link>
            <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        &copy; {new Date().getFullYear()} HealHub. All rights reserved.
      </footer>
    </div>
  )
}
