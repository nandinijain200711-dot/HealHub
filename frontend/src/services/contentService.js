import api from './api'

export const contentService = {
  get() {
    return api.get('/content')
  },
  update(data) {
    return api.put('/content', data)
  },
}
