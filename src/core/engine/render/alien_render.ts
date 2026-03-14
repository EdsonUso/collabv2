import type { Alien } from "../entities/types"
import type { ThemePalette } from "../theme_colors"

function drawAlienBody(
  ctx: CanvasRenderingContext2D,
  alien: Alien,
  palette: ThemePalette,
  time: number
): void {
  const { radius: r, alienType } = alien
  const fg = palette.foreground
  const accent = palette.primary

  switch (alienType) {
    case 0: {
      ctx.fillStyle = fg
      ctx.beginPath()
      ctx.ellipse(0, 0, r, r * 0.85, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = fg
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-r * 0.3, -r * 0.7)
      ctx.lineTo(-r * 0.5, -r * 1.3)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(r * 0.3, -r * 0.7)
      ctx.lineTo(r * 0.5, -r * 1.3)
      ctx.stroke()

      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(-r * 0.5, -r * 1.3, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(r * 0.5, -r * 1.3, 3, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 1: {
      ctx.fillStyle = fg
      ctx.beginPath()
      ctx.ellipse(0, 0, r * 1.3, r * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = palette.muted
      ctx.beginPath()
      ctx.ellipse(0, -r * 0.2, r * 0.6, r * 0.6, 0, Math.PI, Math.PI * 2)
      ctx.fill()

      for (let i = 0; i < 4; i++) {
        const lx = -r + (i * 2 * r) / 3 + r / 3
        const blink = Math.sin(time * 0.05 + i * 1.5) > 0
        ctx.fillStyle = blink ? accent : palette.muted
        ctx.beginPath()
        ctx.arc(lx, r * 0.15, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 2: {
      ctx.fillStyle = fg
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const wobble = Math.sin(time * 0.03 + i * 0.8) * r * 0.15
        const px = Math.cos(angle) * (r + wobble)
        const py = Math.sin(angle) * (r + wobble)
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          const prevAngle = ((i - 0.5) / 8) * Math.PI * 2
          const cpx = Math.cos(prevAngle) * (r * 1.2 + wobble)
          const cpy = Math.sin(prevAngle) * (r * 1.2 + wobble)
          ctx.quadraticCurveTo(cpx, cpy, px, py)
        }
      }
      ctx.closePath()
      ctx.fill()
      break
    }
    case 3: {
      ctx.fillStyle = fg
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        const outerR = r * (1 + Math.sin(time * 0.04 + i) * 0.2)
        const innerR = r * 0.55

        const ox = Math.cos(angle) * outerR
        const oy = Math.sin(angle) * outerR
        const midAngle = ((i + 0.5) / 6) * Math.PI * 2
        const ix = Math.cos(midAngle) * innerR
        const iy = Math.sin(midAngle) * innerR

        if (i === 0) ctx.moveTo(ox, oy)
        else ctx.lineTo(ox, oy)
        ctx.lineTo(ix, iy)
      }
      ctx.closePath()
      ctx.fill()
      break
    }
  }
}

function drawAlienEyes(
  ctx: CanvasRenderingContext2D,
  alien: Alien,
  palette: ThemePalette
): void {
  const { radius: r, alienType, eyes } = alien
  const isBlinking = eyes.blinkDuration > 0
  const eyeSpacing = r * 0.35
  const eyeY = alienType === 1 ? -r * 0.35 : -r * 0.1
  const eyeSize = r * 0.22

  if (!isBlinking) {
    ctx.fillStyle = palette.background
    ctx.beginPath()
    ctx.ellipse(-eyeSpacing, eyeY, eyeSize, eyeSize * 1.1, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(eyeSpacing, eyeY, eyeSize, eyeSize * 1.1, 0, 0, Math.PI * 2)
    ctx.fill()

    const lookX = Math.cos(eyes.lookAngle) * eyeSize * 0.3
    const lookY = Math.sin(eyes.lookAngle) * eyeSize * 0.3
    ctx.fillStyle = palette.foreground
    ctx.beginPath()
    ctx.arc(-eyeSpacing + lookX, eyeY + lookY, eyeSize * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(eyeSpacing + lookX, eyeY + lookY, eyeSize * 0.5, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.strokeStyle = palette.background
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-eyeSpacing - eyeSize, eyeY)
    ctx.lineTo(-eyeSpacing + eyeSize, eyeY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(eyeSpacing - eyeSize, eyeY)
    ctx.lineTo(eyeSpacing + eyeSize, eyeY)
    ctx.stroke()
  }
}

export function drawAlien(
  ctx: CanvasRenderingContext2D,
  alien: Alien,
  time: number,
  palette: ThemePalette
): void {
  if (!alien.alive) return

  ctx.save()
  ctx.translate(alien.pos.x, alien.pos.y)
  ctx.rotate(alien.rotation)

  if (alien.flash > 0) {
    ctx.shadowColor = palette.primary
    ctx.shadowBlur = 20
  }

  drawAlienBody(ctx, alien, palette, time)
  drawAlienEyes(ctx, alien, palette)

  ctx.restore()
}

export function drawAllAliens(
  ctx: CanvasRenderingContext2D,
  aliens: Alien[],
  time: number,
  palette: ThemePalette
): void {
  for (const alien of aliens) {
    drawAlien(ctx, alien, time, palette)
  }
}
