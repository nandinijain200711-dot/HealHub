import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { chatService } from '../../services/chatService'
import { formatDateTime } from '../../lib/utils'

export default function ChatHistory() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    chatService.getAllSessions()
      .then((res) => setSessions(res.data.sessions || res.data.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (error) {
    return <div className="page-container text-center text-red-500 py-12">Failed to load chat history.</div>
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Chat History</h1>

      {sessions.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p>No chat sessions found.</p>
          <Link to="/chatbot" className="text-primary-600 hover:underline mt-2 inline-block">Start a new consultation</Link>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {sessions.map((s) => (
            <button
              key={s._id || s.id}
              onClick={() => setSelected(s)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected?._id === s._id || selected?.id === s.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-100 bg-white hover:border-primary-200'
              }`}
            >
              <p className="text-sm font-medium text-gray-900 truncate">
                {s.initial_symptom || 'Chat Session'}
              </p>
              <p className="text-xs text-gray-500 mt-1">{formatDateTime(s.created_at)}</p>
              <p className="text-xs text-gray-400 mt-1">{s.messages?.length || 0} messages</p>
            </button>
          ))}
        </div>

        <div className="md:col-span-2">
          {selected ? (
            <div className="card">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Session Details</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {selected.user_name} &middot; {formatDateTime(selected.created_at)}
                </p>
                {selected.summary && (
                  <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                    <strong>Summary:</strong> {selected.summary}
                  </p>
                )}
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {(selected.messages || []).map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                      msg.role === 'user' ? 'bg-primary-100 text-primary-900' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center h-64">
              <p className="text-gray-400">Select a session to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
