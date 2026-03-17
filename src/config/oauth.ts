const API_BASE = "http://localhost:8080/api"

type OAuthProvider = "github" | "google"

export function getOAuthUrl(provider: OAuthProvider): string {
  return `${API_BASE}/oauth2/authorize/${provider}`
}

export type { OAuthProvider }
