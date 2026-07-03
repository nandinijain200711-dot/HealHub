import { useState, useEffect } from 'react'
import { contentService } from '../../services/contentService'

export default function About() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contentService.get()
      .then((res) => setContent(res.data.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About HealHub</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed">
            {content?.about_content || 'HealHub is an AI-powered healthcare platform dedicated to providing accessible, intelligent health consultations and seamless appointment management.'}
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-sm text-gray-600">To make healthcare accessible and convenient through AI-powered technology.</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Our Vision</h3>
              <p className="text-sm text-gray-600">A world where quality healthcare guidance is available to everyone, anywhere.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
