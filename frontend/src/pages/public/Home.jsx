import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { contentService } from '../../services/contentService'
import { doctorService } from '../../services/doctorService'
import { faqService } from '../../services/faqService'
import { contactService } from '../../services/contactService'
import { ROUTES } from '../../lib/constants'
import { extractData, extractList } from '../../lib/utils'

function SectionLoading({ visible }) {
  if (!visible) return null
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
    </div>
  )
}

function SectionError({ message }) {
  return (
    <div className="text-center py-8 text-gray-400 text-sm">
      {message}
    </div>
  )
}

export default function Home() {
  const [content, setContent] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [faqs, setFaqs] = useState([])
  const [contact, setContact] = useState(null)
  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [loadingFaqs, setLoadingFaqs] = useState(true)
  const [loadingContact, setLoadingContact] = useState(true)
  const [errorContent, setErrorContent] = useState(false)
  const [errorDoctors, setErrorDoctors] = useState(false)
  const [errorFaqs, setErrorFaqs] = useState(false)
  const [errorContact, setErrorContact] = useState(false)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false

    contentService.get()
      .then((res) => { if (!cancelledRef.current) setContent(extractData(res)) })
      .catch(() => { if (!cancelledRef.current) setErrorContent(true) })
      .finally(() => { if (!cancelledRef.current) setLoadingContent(false) })

    doctorService.getAll()
      .then((res) => { if (!cancelledRef.current) setDoctors(extractList(res, 'doctors')) })
      .catch(() => { if (!cancelledRef.current) setErrorDoctors(true) })
      .finally(() => { if (!cancelledRef.current) setLoadingDoctors(false) })

    faqService.getAll()
      .then((res) => { if (!cancelledRef.current) setFaqs(extractList(res, 'faqs')) })
      .catch(() => { if (!cancelledRef.current) setErrorFaqs(true) })
      .finally(() => { if (!cancelledRef.current) setLoadingFaqs(false) })

    contactService.get()
      .then((res) => { if (!cancelledRef.current) setContact(extractData(res)) })
      .catch(() => { if (!cancelledRef.current) setErrorContact(true) })
      .finally(() => { if (!cancelledRef.current) setLoadingContact(false) })

    return () => { cancelledRef.current = true }
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <SectionLoading visible={loadingContent} />
          {!loadingContent && (
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                {content?.home_headline || 'Welcome to HealHub'}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600">
                {content?.home_subheading || 'Your AI-Powered Healthcare Platform'}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={ROUTES.REGISTER} className="btn-primary text-lg px-8 py-3">Get Started</Link>
                <Link to={ROUTES.USER_CHATBOT} className="btn-secondary text-lg px-8 py-3">Try AI Chatbot</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {content?.benefits_title || 'Why Choose HealHub?'}
          </h2>
          {errorContent ? (
            <SectionError message="Unable to load features." />
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {(content?.benefits_list || []).map((benefit, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Our Doctors</h2>
            <Link to={ROUTES.DOCTORS} className="text-primary-600 hover:text-primary-700 font-medium text-sm">View All</Link>
          </div>
          {errorDoctors ? (
            <SectionError message="Unable to load doctors." />
          ) : loadingDoctors ? (
            <SectionLoading visible={true} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.slice(0, 4).map((doc) => (
                <div key={doc._id || doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      {doc.name?.charAt(0) || 'D'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center">{doc.name}</h3>
                  <p className="text-primary-600 text-sm font-medium text-center">{doc.specialization}</p>
                  <p className="text-gray-500 text-xs text-center mt-2">{doc.experience_years} years experience</p>
                </div>
              ))}
              {!loadingDoctors && doctors.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-8">No doctors available.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">FAQ</h2>
            <Link to={ROUTES.FAQ} className="text-primary-600 hover:text-primary-700 font-medium text-sm">View All</Link>
          </div>
          {errorFaqs ? (
            <SectionError message="Unable to load FAQs." />
          ) : loadingFaqs ? (
            <SectionLoading visible={true} />
          ) : (
            <div className="space-y-3">
              {faqs.slice(0, 4).map((faq) => (
                <details key={faq._id || faq.id} className="group">
                  <summary className="flex justify-between items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                    <svg className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-2 px-4 text-sm text-gray-600 pb-4">{faq.answer}</p>
                </details>
              ))}
              {!loadingFaqs && faqs.length === 0 && (
                <p className="text-center text-gray-400 py-8">No FAQs available.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-primary-100 mb-8">
            {contact ? `${contact.phone || ''} ${contact.email ? '| ' + contact.email : ''}` : 'We are here to help you.'}
          </p>
          <Link to={ROUTES.CONTACT} className="inline-block bg-white text-primary-600 font-medium py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
