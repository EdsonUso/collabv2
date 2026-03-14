import type { Projectile } from "../entities/types";
import { PHYSICS } from "../simulation_config";



let projId = 5000;

export function createProjectile(
  x: number,
  y: number,
  vx: number,
  vy: number,
  owner: "ship" | "player" = "ship"
): Projectile {
  return {
    id: ++projId,
    type: "projectile",
    pos: { x, y },
    vel: { x: vx, y: vy },
    radius: PHYSICS.projectile.radius,
    mass: 0.1,
    life: PHYSICS.projectile.maxLife,
    owner,
    alive: true,
    trail: [],
  };
}