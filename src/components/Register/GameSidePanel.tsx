import { GameHUD } from "@/components/Login/GameHUD"

interface GameSidePanelProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  gameMode: boolean
  score: number
  shipHP: number
}

export function GameSidePanel({ canvasRef, gameMode, score, shipHP }: GameSidePanelProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {gameMode && <GameHUD score={score} shipHP={shipHP} />}
    </div>
  )
}
