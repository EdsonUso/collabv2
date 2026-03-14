import type { Explosion, Star } from "../entities/types";

export function createStar(canvasW: number, canvasH: number): Star {
  const roll = Math.random()
  const size =
    roll < 0.75
      ? 0.2 + Math.random() * 0.3
      : roll < 0.93
        ? 0.5 + Math.random() * 0.4
        : 0.9 + Math.random() * 0.5

  return {
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    size,
    brightness: 0.3 + Math.random() * 0.7,
    thinkleSpeed: 0.003 + Math.random() * 0.012,
    twinkOffset: Math.random() * Math.PI * 2,
    layer: (Math.random() < 0.3 ? 2 : Math.random() < 0.6 ? 1 : 0) as 0 | 1 | 2,
  }
}

export function createExplosion(x: number, y: number, color: string): Explosion {
  return {
    pos: { x, y },
    particles: Array.from({ length: 12 }, () => ({
      vel: {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6,
      },
      life: 30 + Math.random() * 20,
      maxLife: 50,
      size: 2 + Math.random() * 4,
    })),
    color,
    alive: true,
  }
}
