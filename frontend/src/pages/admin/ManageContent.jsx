import { useState, useEffect } from 'react'
import { contentService } from '../../services/contentService'

export default function ManageContent() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [mutationError, setMutationError] = useState('')

  useEffect(() => {
    contentService.get()
      .then((res) => setContent(res.data.data || res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSuccess('')
    setMutationError('')
    try {
      await contentService.update(content)
      setSuccess('Content updated successfully.')
    } catch (err) {
      setMutationError(err.response?.data?.detail || 'Failed to save content')
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
    return <div className="text-center text-red-500 py-12">Failed to load content.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Website Content</h1>

      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{success}</div>}
      {mutationError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{mutationError}</div>}

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Home Headline</label>
          <input className="input-field" value={content?.home_headline || ''} onChange={(e) => setContent({ ...content, home_headline: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Home Subheading</label>
          <input className="input-field" value={content?.home_subheading || ''} onChange={(e) => setContent({ ...content, home_subheading: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About Content</label>
          <textarea className="input-field" rows={4} value={content?.about_content || ''} onChange={(e) => setContent({ ...content, about_content: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Benefits Title</label>
          <input className="input-field" value={content?.benefits_title || ''} onChange={(e) => setContent({ ...content, benefits_title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Benefits List (comma separated)</label>
          <input className="input-field" value={(content?.benefits_list || []).join(', ')} onChange={(e) => setContent({ ...content, benefits_list: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
