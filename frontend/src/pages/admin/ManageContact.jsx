import { useState, useEffect } from 'react'
import { contactService } from '../../services/contactService'

export default function ManageContact() {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [mutationError, setMutationError] = useState('')

  useEffect(() => {
    contactService.get()
      .then((res) => setContact(res.data.data || res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSuccess('')
    setMutationError('')
    try {
      await contactService.update(contact)
      setSuccess('Contact information updated successfully.')
    } catch (err) {
      setMutationError(err.response?.data?.detail || 'Failed to save contact info')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">Failed to load contact info.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h1>

      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{success}</div>}
      {mutationError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{mutationError}</div>}

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input className="input-field" value={contact?.address || ''} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input className="input-field" value={contact?.phone || ''} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="input-field" value={contact?.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
          <input className="input-field" value={contact?.business_hours || ''} onChange={(e) => setContact({ ...contact, business_hours: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
          <input className="input-field" value={contact?.emergency_contact || ''} onChange={(e) => setContact({ ...contact, emergency_contact: e.target.value })} />
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
