import api from './api'

export const contactService = {
  get() {
    return api.get('/contact')
  },
  update(data) {
    return api.put('/contact', data)
  },
}
