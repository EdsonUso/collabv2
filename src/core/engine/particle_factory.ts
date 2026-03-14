import type { Explosion, Star } from "./entities/types";

export function createStar(canvasW: number, canvasH: number): Star {
  return {
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    size: Math.random() * 2.2 + 0.3,
    brightness: Math.random(),
    thinkleSpeed: 0.005 + Math.random() * 0.02,
    twinkOffset: Math.random() * Math.PI * 2,
    layer: (Math.random() < 0.3 ? 2 : Math.random() < 0.6 ? 1 : 0) as 0 | 1 | 2,
  };
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
  };
}
 