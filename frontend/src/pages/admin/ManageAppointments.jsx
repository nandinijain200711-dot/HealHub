import { useState, useEffect } from 'react'
import { appointmentService } from '../../services/appointmentService'
import { formatDate, formatTime } from '../../lib/utils'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [mutationError, setMutationError] = useState('')

  const fetch = () => {
    setLoading(true)
    appointmentService.getAll()
      .then((res) => setAppointments(res.data.appointments || res.data.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleAction = async (id, action) => {
    setActionLoading(`${id}-${action}`)
    setMutationError('')
    try {
      if (action === 'confirm') await appointmentService.confirm(id)
      else if (action === 'complete') await appointmentService.complete(id)
      else if (action === 'cancel') await appointmentService.cancel(id)
      fetch()
    } catch (err) {
      setMutationError(err.response?.data?.detail || `Failed to ${action} appointment`)
    }
    setActionLoading(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">Failed to load appointments.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Appointments</h1>

      {mutationError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{mutationError}</div>}

      {appointments.length === 0 && (
        <div className="text-center text-gray-400 py-8">No appointments found.</div>
      )}

      <div className="space-y-3">
        {appointments.map((apt) => {
          const id = apt._id || apt.id
          const isLoading = actionLoading === `${id}-confirm` || actionLoading === `${id}-complete` || actionLoading === `${id}-cancel`

          return (
            <div key={id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{apt.user_name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[apt.status] || 'bg-gray-100 text-gray-800'}`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(apt.appointment_date)} at {formatTime(apt.appointment_time)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {apt.user_email} &middot; {apt.user_phone}
                  </p>
                  {apt.reason && <p className="text-sm text-gray-600 mt-2">{apt.reason}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {apt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(id, 'confirm')}
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white text-sm py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === `${id}-confirm` ? '...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => handleAction(id, 'cancel')}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === `${id}-cancel` ? '...' : 'Cancel'}
                      </button>
                    </>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleAction(id, 'complete')}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      {actionLoading === `${id}-complete` ? '...' : 'Complete'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
