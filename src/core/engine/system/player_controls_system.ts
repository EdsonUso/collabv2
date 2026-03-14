import type { InputState } from "..";
import type { Projectile, Ship } from "../entities/types";
import { createProjectile } from "../factory/projectile_factory";

import { PHYSICS } from "../simulation_config";
import { vec2 } from "../vec2";

export function updatePlayerControl(
    ship: Ship,
    input: InputState
): Projectile[] {
    const newProjectiles: Projectile[] = []
    if (!ship.alive) return newProjectiles;

    const { keys, mouse, mouseDown } = input;
    const accel = PHYSICS.ship.playerAccel;

    if (keys["w"] || keys["arrowup"]) ship.vel.y -= accel;
    if (keys["s"] || keys["arrowdown"]) ship.vel.y += accel;
    if (keys["a"] || keys["arrowleft"]) ship.vel.x -= accel;
    if (keys["d"] || keys["arrowright"]) ship.vel.x += accel;

    const toMouse = vec2.sub(mouse, ship.pos);
    ship.rotation = Math.atan2(toMouse.y, toMouse.x)

    ship.fireTimer--;
  if (mouseDown && ship.fireTimer <= 0) {
    const dir = vec2.norm(toMouse);
    newProjectiles.push(
      createProjectile(
        ship.pos.x + dir.x * 25,
        ship.pos.y + dir.y * 25,
        dir.x * PHYSICS.projectile.speed + ship.vel.x * 0.3,
        dir.y * PHYSICS.projectile.speed + ship.vel.y * 0.3,
        "player"
      )
    );
    ship.fireTimer = PHYSICS.ship.playerFireRate;
  }

  return newProjectiles;
}