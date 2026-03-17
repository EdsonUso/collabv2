import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth"
import api from "./api"
import { tokenStorage } from "./token.storage"

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", payload)
    tokenStorage.setTokens(
      data.data.acessToken,
      data.data.refreshToken,
      data.data.expiresIn
    )
    return data
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", payload)
    tokenStorage.setTokens(
      data.data.acessToken,
      data.data.refreshToken,
      data.data.expiresIn
    )
    return data
  },

  logout() {
    tokenStorage.clear()
  },
}
