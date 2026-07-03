import api from './api'

export const authService = {
  register(data) {
    return api.post('/auth/register', data)
  },
  login(data) {
    return api.post('/auth/login', data)
  },
  adminLogin(data) {
    return api.post('/auth/admin/login', data)
  },
  verifyToken() {
    return api.post('/auth/verify-token')
  },
}
