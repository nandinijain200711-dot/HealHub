import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { formatDateTime } from '../../lib/utils'

export default function SystemHealth() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const check = () => {
    setLoading(true)
    setError(false)
    adminService.healthCheck()
      .then((res) => setHealth(res.data.data || res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { check() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to check system health.</p>
        <button onClick={check} className="btn-secondary">Retry</button>
      </div>
    )
  }

  const items = [
    { label: 'Status', value: health?.status, color: health?.status === 'healthy' ? 'text-green-600' : 'text-red-600' },
    { label: 'Database', value: health?.database, color: health?.database === 'connected' ? 'text-green-600' : 'text-red-600' },
    { label: 'Last Checked', value: health?.timestamp ? formatDateTime(health.timestamp) : 'N/A', color: 'text-gray-900' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <button onClick={check} className="btn-secondary">Refresh</button>
      </div>

      <div className="card">
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
              <span className="text-gray-600">{item.label}</span>
              <span className={`font-semibold capitalize ${item.color}`}>{item.value || 'Unknown'}</span>
            </div>
          ))}
        </div>
      </div>

      {health?.status === 'healthy' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          All systems operational.
        </div>
      )}
    </div>
  )
}
