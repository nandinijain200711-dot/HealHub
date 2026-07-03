import api from './api'

export const appointmentService = {
  book(data) {
    return api.post('/appointments/book', data)
  },
  getById(id) {
    return api.get(`/appointments/${id}`)
  },
  getMyAppointments(params) {
    return api.get('/appointments/user/my-appointments', { params })
  },
  getAll(params) {
    return api.get('/appointments', { params })
  },
  update(id, data) {
    return api.put(`/appointments/${id}`, data)
  },
  cancel(id, reason) {
    return api.post(`/appointments/${id}/cancel`, null, { params: { reason } })
  },
  confirm(id) {
    return api.post(`/appointments/${id}/confirm`)
  },
  complete(id) {
    return api.post(`/appointments/${id}/complete`)
  },
}
