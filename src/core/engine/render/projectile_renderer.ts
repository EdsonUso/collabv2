import type { Projectile } from "../entities/types"
import type { ThemePalette } from "../theme_colors"

export function drawProjectile(
  ctx: CanvasRenderingContext2D,
  proj: Projectile,
  palette: ThemePalette
): void {
  if (!proj.alive) return

  for (let i = 0; i < proj.trail.length; i++) {
    const t = proj.trail[i]
    const alpha = (i / proj.trail.length) * 0.35
    ctx.globalAlpha = alpha
    ctx.fillStyle = palette.primary
    ctx.beginPath()
    ctx.arc(t.x, t.y, 2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  ctx.fillStyle = palette.primary
  ctx.shadowColor = palette.primary
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.arc(proj.pos.x, proj.pos.y, proj.radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
}

export function drawAllProjectiles(
  ctx: CanvasRenderingContext2D,
  projectiles: Projectile[],
  palette: ThemePalette
): void {
  for (const proj of projectiles) {
    drawProjectile(ctx, proj, palette)
  }
}
