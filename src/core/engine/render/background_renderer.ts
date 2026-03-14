import type { ThemePalette } from "../theme_colors"

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: ThemePalette
): void {
  ctx.fillStyle = palette.background
  ctx.fillRect(0, 0, w, h)

  const vignette = ctx.createRadialGradient(
    w * 0.5, h * 0.5, Math.min(w, h) * 0.3,
    w * 0.5, h * 0.5, Math.max(w, h) * 0.8
  )
  vignette.addColorStop(0, "transparent")
  vignette.addColorStop(1, palette.isDark
    ? "rgba(0,0,0,0.35)"
    : "rgba(0,0,0,0.06)"
  )
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)
}
