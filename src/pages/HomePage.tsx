import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useNavigate } from "react-router-dom"
import { PATHS } from "@/routes/paths"

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  console.log(user)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h1 className="text-xl font-bold text-primary">Collab</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user?.displayName}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(PATHS.LOGIN)}
            >
              Entrar
            </Button>
          )}
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-6 py-24">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Hello, Home
        </h2>
        <p className="text-muted-foreground text-lg">
          {isAuthenticated
            ? `Bem-vindo de volta, ${user?.displayName}!`
            : "Explore o Collab. Entre para ter acesso completo."}
        </p>
      </main>
    </div>
  )
}
