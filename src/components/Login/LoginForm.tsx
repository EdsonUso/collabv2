import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ThemeToggle } from "../ThemeToggle"
import { ArrowRight, Lock, Mail } from "lucide-react"
import { Button } from "../ui/button"
import { SocialLogin } from "./SocialLogin"
import { useAuth } from "@/contexts/AuthContext"
import { PATHS } from "@/routes/paths"
import { AxiosError } from "axios"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login({ email, password })
      navigate(PATHS.HOME)
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message ?? "Erro ao fazer login.")
      } else {
        setError("Erro ao fazer login.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative z-10 min-h-screen overflow-hidden flex items-center justify-center pointer-events-none">

      <div className="absolute top-6 right-6 z-50 pointer-events-auto">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6 pointer-events-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
            <svg viewBox="0 0 32 32" className="w-9 h-9 text-primary">
              <circle cx="8" cy="16" r="3" fill="currentColor" />
              <circle cx="24" cy="16" r="3" fill="currentColor" />
              <circle cx="16" cy="8" r="3" fill="currentColor" />
              <circle cx="16" cy="24" r="3" fill="currentColor" />
              <path
                d="M8 16 L16 8 M16 8 L24 16 M24 16 L16 24 M16 24 L8 16"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Collab</h1>
          <p className="text-muted-foreground mt-2">Onde talentos se conectam</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className={`text-sm font-medium transition-colors ${
                focusedField === "email" ? "text-primary" : "text-foreground"
              }`}
            >
              Email
            </label>
            <div className="relative group">
              <Mail
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === "email" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <input
                id="email"
                type="email"
                placeholder="seuemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-0 border-b-2 border-border pl-8 pr-0 py-3 text-foreground placeholder:text-muted-foreground/60
                  focus:outline-none focus:border-primary transition-colors
                  [&:-webkit-autofill]:bg-transparent
                  [&:-webkit-autofill]:[-webkit-text-fill-color:inherit]
                  [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className={`text-sm font-medium transition-colors ${
                  focusedField === "password" ? "text-primary" : "text-foreground"
                }`}
              >
                Senha
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Esqueceu?
              </a>
            </div>
            <div className="relative">
              <Lock
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focusedField === "password" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-0 border-b-2 border-border pl-8 pr-0 py-3 text-foreground
                  placeholder:text-muted-foreground/60 focus:outline-none
                  focus:border-primary transition-colors
                  [&:-webkit-autofill]:bg-transparent
                  [&:-webkit-autofill]:[-webkit-text-fill-color:inherit]
                  [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-xl group mt-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Entrando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Entrar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-xs text-muted-foreground">ou</span>
          </div>
        </div>

        <SocialLogin />

        <p className="text-center text-sm text-muted-foreground mt-10">
          Novo por aqui?{" "}
          <Link to={PATHS.REGISTER} className="text-primary hover:underline font-medium">
            Criar Conta
          </Link>
        </p>
      </div>
    </div>
  )
}
