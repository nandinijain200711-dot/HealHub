import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { appointmentService } from '../../services/appointmentService'
import { ROUTES } from '../../lib/constants'
import { formatDate, formatTime } from '../../lib/utils'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    appointmentService.getMyAppointments()
      .then((res) => setAppointments(res.data.appointments || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (error) {
    return <div className="page-container text-center text-red-500 py-12">Failed to load appointments.</div>
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your upcoming and past appointments.</p>
        </div>
        <Link to={ROUTES.USER_BOOK_APPOINTMENT} className="btn-primary">Book New</Link>
      </div>

      {appointments.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-400 mb-4">No appointments found.</p>
          <Link to={ROUTES.USER_BOOK_APPOINTMENT} className="text-primary-600 font-medium hover:underline">
            Book your first appointment
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {appointments.map((apt) => (
          <div key={apt._id || apt.id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {formatDate(apt.appointment_date)} at {formatTime(apt.appointment_time)}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[apt.status] || 'bg-gray-100 text-gray-800'}`}>
                    {apt.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{apt.reason}</p>
                <p className="text-xs text-gray-400 mt-1">{apt.user_phone}</p>
              </div>
              <div className="flex-shrink-0">
                {apt.meet_link && (
                  <a
                    href={apt.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm py-2 px-4 inline-block"
                  >
                    Join Meet
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
