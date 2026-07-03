import api from './api'

export const userService = {
  getProfile() {
    return api.get('/users/me')
  },
  updateProfile(data) {
    return api.put('/users/me', data)
  },
  getPublicProfile(userId) {
    return api.get(`/users/${userId}`)
  },
}
