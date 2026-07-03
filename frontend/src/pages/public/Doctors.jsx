import { useState, useEffect } from 'react'
import { doctorService } from '../../services/doctorService'
import { extractList } from '../../lib/utils'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [allSpecializations, setAllSpecializations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [specialization, setSpecialization] = useState('')

  useEffect(() => {
    doctorService.getAll()
      .then((res) => {
        const all = extractList(res, 'doctors')
        const specs = [...new Set(all.map((d) => d.specialization).filter(Boolean))]
        setAllSpecializations(specs)
        setDoctors(all)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const fetchDoctors = (spec) => {
    if (!spec) return
    setLoading(true)
    setError(false)
    doctorService.getBySpecialization(spec)
      .then((res) => setDoctors(extractList(res, 'doctors')))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  const handleSpecializationChange = (spec) => {
    setSpecialization(spec)
    if (spec) fetchDoctors(spec)
    else {
      setLoading(true)
      setError(false)
      doctorService.getAll()
        .then((res) => setDoctors(extractList(res, 'doctors')))
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }
  }

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Doctors</h1>
      <p className="text-gray-600 mb-8">Meet our team of experienced healthcare professionals.</p>

      {allSpecializations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleSpecializationChange('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!specialization ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            All
          </button>
          {allSpecializations.map((spec) => (
            <button
              key={spec}
              onClick={() => handleSpecializationChange(spec)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${specialization === spec ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {spec}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      )}

      {error && <div className="text-center py-12 text-red-500">Failed to load doctors.</div>}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-8">No doctors found.</div>
          )}
          {doctors.map((doc) => (
            <div key={doc._id || doc.id} className="card-hover">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary-600">{doc.name?.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
              <p className="text-primary-600 text-sm font-medium">{doc.specialization}</p>
              <p className="text-gray-500 text-sm mt-2">{doc.bio}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                <span>{doc.experience_years} years exp.</span>
                <span>{doc.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
