import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { authService } from '../services/authService'
import {
  getAuthToken, setAuthToken, removeAuthToken,
  getUserFromStorage, setUserInStorage, removeUserFromStorage,
} from '../lib/utils'
import { ROLES } from '../lib/constants'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = getAuthToken()
    const savedUser = getUserFromStorage()
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials)
    const t = data.access_token || data.token
    const u = data.user || data
    setAuthToken(t)
    setUserInStorage(u)
    setToken(t)
    setUser(u)
    return u
  }, [])

  const adminLogin = useCallback(async (credentials) => {
    const { data } = await authService.adminLogin(credentials)
    const t = data.access_token || data.token
    const u = { ...(data.user || data), role: 'admin' }
    setAuthToken(t)
    setUserInStorage(u)
    setToken(t)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (userData) => {
    const { data } = await authService.register(userData)
    const t = data.access_token || data.token
    const u = { ...(data.user || data), name: userData.name || data.user?.name }
    setAuthToken(t)
    setUserInStorage(u)
    setToken(t)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    removeAuthToken()
    removeUserFromStorage()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === ROLES.ADMIN,
    login,
    adminLogin,
    register,
    logout,
  }), [user, token, loading, login, adminLogin, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
