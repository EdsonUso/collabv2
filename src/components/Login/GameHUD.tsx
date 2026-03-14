interface GameHUDProps {
  score: number
  shipHP: number
}

export function GameHUD({ score, shipHP }: GameHUDProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-20 pointer-events-none">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">HP</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm transition-colors ${
                  i < shipHP
                    ? "bg-primary shadow-[0_0_6px] shadow-primary/50"
                    : "bg-muted/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Score</span>
          <span className="text-lg font-bold text-foreground tabular-nums">
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2">
        <span className="text-xs text-muted-foreground/60">
          ESC para sair
        </span>
      </div>
    </div>
  )
}
