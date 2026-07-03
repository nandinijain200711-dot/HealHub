import { useState, useEffect } from 'react'
import { faqService } from '../../services/faqService'

export default function ManageFAQs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [mutationError, setMutationError] = useState('')
  const [form, setForm] = useState({ question: '', answer: '', category: 'General', order: '' })

  const fetch = () => {
    setLoading(true)
    faqService.getAll()
      .then((res) => setFaqs(res.data.faqs || res.data.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => {
    setMutationError(''); setEditing(null); setForm({ question: '', answer: '', category: 'General', order: '' }); setModalOpen(true)
  }

  const openEdit = (faq) => {
    setMutationError(''); setEditing(faq); setForm({ question: faq.question, answer: faq.answer, category: faq.category, order: faq.order }); setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMutationError('')
    try {
      const payload = { ...form, order: form.order ? parseInt(form.order) : undefined }
      if (editing) await faqService.update(editing._id || editing.id, payload)
      else await faqService.create(payload)
      setModalOpen(false)
      fetch()
    } catch (err) {
      setMutationError(err.response?.data?.detail || 'Failed to save FAQ')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return
    try { await faqService.delete(id); fetch() }
    catch (err) { setMutationError(err.response?.data?.detail || 'Failed to delete FAQ') }
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
        <h1 className="text-2xl font-bold text-gray-900">Manage FAQs ({faqs.length})</h1>
        <button onClick={openCreate} className="btn-primary">Add FAQ</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">Failed to load FAQs.</div>}

      {!error && faqs.length === 0 && <div className="text-center text-gray-400 py-8">No FAQs.</div>}

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq._id || faq.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{faq.category}</span>
                </div>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(faq)} className="btn-secondary text-sm py-1.5 px-3">Edit</button>
                <button onClick={() => handleDelete(faq._id || faq.id)} className="bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 px-3 rounded-lg">Delete</button>
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
              <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit FAQ' : 'Add FAQ'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {mutationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{mutationError}</div>
              )}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Question</label><input className="input-field" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Answer</label><textarea className="input-field" rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Order</label><input type="number" className="input-field" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} /></div>
              <button type="submit" className="btn-primary w-full" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update FAQ' : 'Create FAQ'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
