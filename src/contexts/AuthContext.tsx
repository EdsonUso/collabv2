import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { LoginPayload, RegisterPayload, User } from "@/types/auth"
import { authService } from "@/services/auth.service"
import { tokenStorage } from "@/services/token.storage"
import api from "@/services/api"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  const loadUser = useCallback(async () => {
    const token = tokenStorage.getAccessToken()
    if (!token) {
      setState({ user: null, isAuthenticated: false, isLoading: false })
      return
    }

    try {
      const { data } = await api.get("/auth/me")
      setState({
        user: data.data,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      tokenStorage.clear()
      setState({ user: null, isAuthenticated: false, isLoading: false })
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload)
    setState({
      user: response.data.user,
      isAuthenticated: true,
      isLoading: false,
    })
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authService.register(payload)
    setState({
      user: response.data.user,
      isAuthenticated: true,
      isLoading: false,
    })
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }, [])

  const value = useMemo(
    () => ({ ...state, login, register, logout }),
    [state, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
