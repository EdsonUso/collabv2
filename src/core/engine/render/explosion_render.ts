import type { Explosion } from "../entities/types";

export function drawExplosion(
  ctx: CanvasRenderingContext2D,
  exp: Explosion
): void {
  if (!exp.alive) return;
 
  for (const p of exp.particles) {
    if (p.life <= 0) continue;
 
    const alpha = p.life / p.maxLife;
    const hex = Math.floor(alpha * 255)
      .toString(16)
      .padStart(2, "0");
 
    ctx.fillStyle = exp.color + hex;
    ctx.beginPath();
    ctx.arc(
      exp.pos.x + p.vel.x * (p.maxLife - p.life) * 0.5,
      exp.pos.y + p.vel.y * (p.maxLife - p.life) * 0.5,
      p.size * alpha,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
 
export function drawAllExplosions(
  ctx: CanvasRenderingContext2D,
  explosions: Explosion[]
): void {
  for (const exp of explosions) {
    drawExplosion(ctx, exp);
  }
}