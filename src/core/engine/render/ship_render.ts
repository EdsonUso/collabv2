import type { Ship } from "../entities/types"
import type { ThemePalette } from "../theme_colors"

export function drawShip(
  ctx: CanvasRenderingContext2D,
  ship: Ship,
  time: number,
  isPlayerControlled: boolean,
  palette: ThemePalette
): void {
  if (!ship.alive) return

  const { pos, rotation, engineFlicker, flash, shield } = ship

  ctx.save()
  ctx.translate(pos.x, pos.y)
  ctx.rotate(rotation)

  if (flash > 0) {
    ctx.shadowColor = palette.primary
    ctx.shadowBlur = 15
  }

  const flicker = 0.6 + Math.sin(time * 0.3 + engineFlicker) * 0.4
  const alpha = Math.floor(flicker * 99)
    .toString(16)
    .padStart(2, "0")
  ctx.fillStyle = palette.primary + alpha
  ctx.shadowColor = palette.primary
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.moveTo(-12, -6)
  ctx.lineTo(-20 - Math.random() * 8, 0)
  ctx.lineTo(-12, 6)
  ctx.closePath()
  ctx.fill()
  ctx.shadowBlur = 0

  ctx.fillStyle = palette.foreground
  ctx.strokeStyle = palette.muted
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(22, 0)
  ctx.lineTo(-10, -12)
  ctx.lineTo(-6, 0)
  ctx.lineTo(-10, 12)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = palette.primary + "33"
  ctx.beginPath()
  ctx.arc(6, 0, 5, 0, Math.PI * 2)
  ctx.fill()

  if (shield > 0) {
    ctx.strokeStyle = palette.primary
    ctx.globalAlpha = shield * 0.5
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, 28, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  ctx.restore()

  if (isPlayerControlled) {
    ctx.save()
    ctx.translate(pos.x, pos.y)
    const pulse = 0.5 + Math.sin(time * 0.08) * 0.3
    ctx.globalAlpha = pulse
    ctx.strokeStyle = palette.primary
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.arc(0, 0, 35, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
    ctx.restore()
  }
}
