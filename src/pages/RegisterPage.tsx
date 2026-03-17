import RegisterForm from "@/components/Register/RegisterForm"
import { GameSidePanel } from "@/components/Register/GameSidePanel"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useSpaceCanvas } from "@/hooks/useSpaceCanvas"

export default function RegisterPage() {
  const { canvasRef, gameMode, score, shipHP } = useSpaceCanvas()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <div className="hidden lg:block lg:flex-1">
        <GameSidePanel
          canvasRef={canvasRef}
          gameMode={gameMode}
          score={score}
          shipHP={shipHP}
        />
      </div>

      <div
        className={`relative flex flex-col transition-all duration-300 ${
          gameMode
            ? "w-80 min-w-80 border-l border-border/40"
            : "w-full lg:w-[480px] lg:min-w-[480px]"
        }`}
      >
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <div className="flex-1 overflow-y-auto py-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
