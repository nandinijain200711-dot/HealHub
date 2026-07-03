import api from './api'

export const chatService = {
  createSession(data) {
    return api.post('/chatbot/session/create', data)
  },
  getSession(id) {
    return api.get(`/chatbot/session/${id}`)
  },
  getAllSessions() {
    return api.get('/chatbot/sessions')
  },
  sendMessage(sessionId, data) {
    return api.post(`/chatbot/session/${sessionId}/message`, data)
  },
  getSummary(sessionId) {
    return api.get(`/chatbot/session/${sessionId}/summary`)
  },
  deleteSession(sessionId) {
    return api.delete(`/chatbot/session/${sessionId}`)
  },
}
