import api from './api'

export const adminService = {
  getProfile() {
    return api.get('/admin/me')
  },
  getDashboardStats() {
    return api.get('/admin/dashboard/stats')
  },
  getChatHistory(params) {
    return api.get('/admin/chat-history', { params })
  },
  getAllUsers(params) {
    return api.get('/admin/users', { params })
  },
  getAllAdmins() {
    return api.get('/admin/admins')
  },
  createAdmin(data) {
    return api.post('/admin/admins', data)
  },
  deleteAdmin(id) {
    return api.delete(`/admin/admins/${id}`)
  },
  healthCheck() {
    return api.get('/admin/health')
  },
}
