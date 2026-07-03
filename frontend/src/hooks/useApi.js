import { useState, useCallback } from 'react'

export function useApi(serviceMethod) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const response = await serviceMethod(...args)
      const result = response.data
      setData(result)
      return result
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [serviceMethod])

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return { data, loading, error, execute, reset }
}
