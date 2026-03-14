import type { Star } from "../entities/types"
import type { ThemePalette } from "../theme_colors"

export function drawStar(
  ctx: CanvasRenderingContext2D,
  star: Star,
  time: number,
  palette: ThemePalette
): void {
  const twinkle =
    0.5 + 0.5 * Math.sin(time * star.thinkleSpeed + star.twinkOffset) ** 2

  ctx.globalAlpha = star.brightness * twinkle
  ctx.fillStyle = palette.foreground
  ctx.beginPath()
  ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
  ctx.fill()

  if (star.size > 1.0) {
    ctx.globalAlpha = star.brightness * twinkle * 0.15
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1
}

export function drawAllStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  time: number,
  palette: ThemePalette
): void {
  for (const star of stars) {
    drawStar(ctx, star, time, palette)
  }
}
