import axios from 'axios'
import { getAuthToken, removeAuthToken, removeUserFromStorage } from '../lib/utils'
import { API_BASE_URL } from '../lib/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken()
      removeUserFromStorage()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
