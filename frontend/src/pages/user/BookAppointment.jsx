import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appointmentService } from '../../services/appointmentService'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../lib/constants'

export default function BookAppointment() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    user_name: user?.name || '',
    user_email: user?.email || '',
    user_phone: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => 
    {
  e.preventDefault()

  setError('')
  setSuccess('')

  if (form.reason.trim().length < 10) {
    setError('Reason must be at least 10 characters long')
    return
  }

  if (form.user_phone.trim().length < 10) {
    setError('Phone number must be at least 10 digits')
    return
  }

  setLoading(true)

  try {
    const { data } = await appointmentService.book(form)

    const meetLink = data.meet_link

    setSuccess(
      `Appointment booked successfully!${
        meetLink ? ' A Google Meet link has been generated.' : ''
      }`
    )

    setTimeout(() => {
      navigate(ROUTES.USER_MY_APPOINTMENTS)
    }, 2000)

  } catch (err) {
    const detail = err.response?.data?.detail

    if (Array.isArray(detail)) {
      setError(
        detail.map(item => item.msg).join(', ')
      )
    } else {
      setError(
        detail ||
        err.response?.data?.message ||
        'Booking failed. Please try again.'
      )
    }
  } finally {
    setLoading(false)
  }
  }

  return (
    <div className="page-container max-w-lg mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h1>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input className="input-field" value={form.user_name} onChange={(e) => setForm({ ...form, user_name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input-field" value={form.user_email} onChange={(e) => setForm({ ...form, user_email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input className="input-field" value={form.user_phone} onChange={(e) => setForm({ ...form, user_phone: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="input-field" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" className="input-field" value={form.appointment_time} onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
            <textarea className="input-field" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  )
}
