import api from './api'

export const doctorService = {
  getAll() {
    return api.get('/doctors')
  },
  getBySpecialization(specialization) {
    return api.get(`/doctors/specialization/${specialization}`)
  },
  getById(id) {
    return api.get(`/doctors/${id}`)
  },
  create(data) {
    return api.post('/doctors', data)
  },
  update(id, data) {
    return api.put(`/doctors/${id}`, data)
  },
  delete(id) {
    return api.delete(`/doctors/${id}`)
  },
}
