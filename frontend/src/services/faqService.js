import api from './api'

export const faqService = {
  getAll() {
    return api.get('/faqs')
  },
  getByCategory(category) {
    return api.get(`/faqs/category/${category}`)
  },
  getById(id) {
    return api.get(`/faqs/${id}`)
  },
  create(data) {
    return api.post('/faqs', data)
  },
  update(id, data) {
    return api.put(`/faqs/${id}`, data)
  },
  delete(id) {
    return api.delete(`/faqs/${id}`)
  },
}
