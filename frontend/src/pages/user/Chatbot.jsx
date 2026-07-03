import { useState, useRef, useEffect } from 'react'
import { chatService } from '../../services/chatService'
import { useAuth } from '../../hooks/useAuth'

export default function Chatbot() {
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startSession = async () => {
    setCreating(true)
    setError('')
    try {
      const { data } = await chatService.createSession({
        user_name: user?.name,
        user_age: user?.age || 0,
        user_gender: user?.gender || 'other',
        user_email: user?.email,
        initial_symptom: 'Started health consultation',
      })
      const sid = data.session_id || data.data?.session_id
      setSessionId(sid)
      setMessages([{ role: 'assistant', content: 'Hello! I am your AI health assistant. Please describe your symptoms or health concerns. Note: This is for informational purposes only and not a substitute for professional medical advice.' }])
    } catch {
      setError('Failed to start session. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !sessionId || sending) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setSending(true)
    setError('')
    try {
      const { data } = await chatService.sendMessage(sessionId, { user_message: userMsg })
      const reply = data.insights || data.message || data.data?.insights || 'No response received.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setSending(false)
    }
  }

  if (!sessionId) {
    return (
      <div className="page-container max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Health Chatbot</h1>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Chat with our AI assistant to get health insights and recommendations.
          Describe your symptoms and receive guidance.
        </p>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg max-w-md mx-auto">{error}</div>}
        <button onClick={startSession} className="btn-primary text-lg px-8 py-3" disabled={creating}>
          {creating ? 'Starting...' : 'Start Consultation'}
        </button>
      </div>
    )
  }

  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="card flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-500">Typing...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            disabled={sending}
          />
          <button onClick={sendMessage} className="btn-primary" disabled={sending || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
