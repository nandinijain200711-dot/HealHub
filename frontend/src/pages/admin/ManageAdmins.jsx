import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { formatDateTime } from '../../lib/utils'

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mutationError, setMutationError] = useState('')
  const [form, setForm] = useState({ username: '', email: '', full_name: '', password: '' })

  const fetch = () => {
    setLoading(true)
    adminService.getAllAdmins()
      .then((res) => setAdmins(res.data.admins || res.data.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => {
    setMutationError('')
    setForm({ username: '', email: '', full_name: '', password: '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMutationError('')
    try {
      await adminService.createAdmin(form)
      setModalOpen(false)
      fetch()
    } catch (err) {
      setMutationError(err.response?.data?.detail || 'Failed to create admin')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admin?')) return
    try { await adminService.deleteAdmin(id); fetch() }
    catch (err) { setMutationError(err.response?.data?.detail || 'Failed to delete admin') }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Admins ({admins.length})</h1>
        <button onClick={openCreate} className="btn-primary">Add Admin</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">Failed to load admins.</div>}

      {!error && admins.length === 0 && (
        <div className="text-center text-gray-400 py-8">No admins. Add your first admin.</div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Username', 'Full Name', 'Email', 'Created', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((a) => (
              <tr key={a._id || a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.username}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{a.full_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{a.email}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(a.created_at)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(a._id || a.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 px-3 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Add Admin</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {mutationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{mutationError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input className="input-field" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input className="input-field" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={saving}>
                {saving ? 'Creating...' : 'Create Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
