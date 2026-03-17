import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { tokenStorage } from "@/services/token.storage"
import { PATHS } from "@/routes/paths"

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const token = searchParams.get("token")
    const errorParam = searchParams.get("error")

    if (errorParam || !token) {
      setError(errorParam ?? "Falha na autenticação. Tente novamente.")
      return
    }

    tokenStorage.setToken(token)

    window.location.href = PATHS.HOME
  }, [searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <a href={PATHS.LOGIN} className="text-primary hover:underline text-sm">
            Voltar ao login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3">
        <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-muted-foreground">Autenticando...</span>
      </div>
    </div>
  )
}
