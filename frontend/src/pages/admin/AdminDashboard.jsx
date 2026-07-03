import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    adminService.getDashboardStats()
      .then((res) => setStats(res.data.data || res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">Failed to load dashboard stats.</div>
  }

  const cards = [
    { label: 'Total Users', value: stats?.users_total, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Appointments', value: stats?.appointments_total, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending', value: stats?.appointments_pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Confirmed', value: stats?.appointments_confirmed, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: stats?.appointments_completed, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Cancelled', value: stats?.appointments_cancelled, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Chat Sessions', value: stats?.chat_sessions_total, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'FAQs', value: stats?.faqs_total, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Doctors', value: stats?.doctors_total, color: 'text-primary-600', bg: 'bg-primary-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`${card.bg} rounded-xl p-5`}>
            <p className="text-sm text-gray-600 font-medium">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
