import { useState, useEffect } from 'react'
import { faqService } from '../../services/faqService'
import { extractList } from '../../lib/utils'

export default function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    faqService.getAll()
      .then((res) => setFaqs(extractList(res, 'faqs')))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8">Find answers to common questions about HealHub.</p>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">Failed to load FAQs. Please try again later.</div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {faqs.length === 0 && (
              <p className="text-center text-gray-400 py-8">No FAQs available.</p>
            )}
            {faqs.map((faq) => {
              const id = faq._id || faq.id
              return (
                <div key={id} className="card">
                  <button
                    className="w-full flex justify-between items-center text-left"
                    onClick={() => setOpenId(openId === id ? null : id)}
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    <svg
                      className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${openId === id ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openId === id && (
                    <p className="mt-3 pt-3 border-t border-gray-100 text-gray-600 text-sm">{faq.answer}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
