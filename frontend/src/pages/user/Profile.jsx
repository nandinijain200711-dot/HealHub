import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../../services/userService'
import { ROUTES } from '../../lib/constants'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    userService.getProfile()
      .then((res) => setProfile(res.data.data || res.data))
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
    return <div className="page-container text-center text-red-500 py-12">Failed to load profile.</div>
  }

  const fields = [
    { label: 'Name', value: profile?.name },
    { label: 'Email', value: profile?.email },
    { label: 'Phone', value: profile?.phone },
    { label: 'Age', value: profile?.age },
    { label: 'Gender', value: profile?.gender },
  ]

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <Link to={ROUTES.USER_EDIT_PROFILE} className="btn-primary text-sm py-2 px-4">Edit Profile</Link>
        </div>
        <div className="space-y-0">
          {fields.map((f) => (
            <div key={f.label} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">{f.label}</span>
              <span className="text-sm font-medium text-gray-900">{f.value || '-'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
