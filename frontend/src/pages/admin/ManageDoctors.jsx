import { useState, useEffect } from 'react'
import { doctorService } from '../../services/doctorService'

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [mutationError, setMutationError] = useState('')
  const [form, setForm] = useState({ name: '', specialization: '', email: '', phone: '', experience_years: '', bio: '' })

  const fetch = () => {
    setLoading(true)
    doctorService.getAll()
      .then((res) => setDoctors(res.data.doctors || res.data.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => {
    setMutationError('')
    setEditing(null)
    setForm({ name: '', specialization: '', email: '', phone: '', experience_years: '', bio: '' })
    setModalOpen(true)
  }

  const openEdit = (doc) => {
    setMutationError('')
    setEditing(doc)
    setForm({
      name: doc.name, specialization: doc.specialization, email: doc.email,
      phone: doc.phone, experience_years: doc.experience_years, bio: doc.bio,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMutationError('')
    try {
      const payload = { ...form, experience_years: parseInt(form.experience_years) }
      if (editing) await doctorService.update(editing._id || editing.id, payload)
      else await doctorService.create(payload)
      setModalOpen(false)
      fetch()
    } catch (err) {
      setMutationError(err.response?.data?.detail || 'Failed to save doctor')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return
    try { await doctorService.delete(id); fetch() }
    catch (err) { setMutationError(err.response?.data?.detail || 'Failed to delete doctor') }
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Doctors ({doctors.length})</h1>
        <button onClick={openCreate} className="btn-primary">Add Doctor</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">Failed to load doctors.</div>}

      {!error && doctors.length === 0 && (
        <div className="text-center text-gray-400 py-8">No doctors. Add your first doctor.</div>
      )}

      <div className="space-y-3">
        {doctors.map((doc) => (
          <div key={doc._id || doc.id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary-600">{doc.name?.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-primary-600">{doc.specialization}</p>
                  <p className="text-xs text-gray-500">{doc.email} &middot; {doc.phone} &middot; {doc.experience_years} years</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(doc)} className="btn-secondary text-sm py-1.5 px-3">Edit</button>
                <button onClick={() => handleDelete(doc._id || doc.id)} className="bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 px-3 rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Doctor' : 'Add Doctor'}</h3>
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
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label><input className="input-field" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label><input type="number" className="input-field" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea className="input-field" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required /></div>
              <button type="submit" className="btn-primary w-full" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Doctor' : 'Create Doctor'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
