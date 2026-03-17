export interface User {
  publicId: string
  displayName: string
  email: string
  avatarUrl: string
  role: string
}

export interface AuthTokens {
  acessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthData extends AuthTokens {
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export type AuthResponse = ApiResponse<AuthData>

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  displayName: string
  email: string
  password: string
}
