import type { Alien, Explosion, Projectile } from "../entities/types"
import { createExplosion } from "../factory/particle_factory"
import { PHYSICS } from "../simulation_config"
import { vec2 } from "../vec2"
import { checkCircleCollision } from "./collision_system"

interface ProjectileUpdateResult {
  newExplosions: Explosion[]
  kills: number
}

export function updateProjectiles(
  projectiles: Projectile[],
  aliens: Alien[],
  canvasW: number,
  canvasH: number,
  explosionColor: string
): ProjectileUpdateResult {
  const newExplosions: Explosion[] = []
  let kills = 0

  for (const proj of projectiles) {
    if (!proj.alive) continue

    proj.trail.push({ x: proj.pos.x, y: proj.pos.y })
    if (proj.trail.length > PHYSICS.projectile.trailLength) {
      proj.trail.shift()
    }

    proj.pos.x += proj.vel.x
    proj.pos.y += proj.vel.y

    proj.life--
    if (
      proj.life <= 0 ||
      proj.pos.x < -20 ||
      proj.pos.x > canvasW + 20 ||
      proj.pos.y < -20 ||
      proj.pos.y > canvasH + 20
    ) {
      proj.alive = false
      continue
    }

    for (const alien of aliens) {
      if (!alien.alive) continue
      if (!checkCircleCollision(proj, alien)) continue

      alien.hp--
      alien.flash = 1

      const dir = vec2.norm(vec2.sub(alien.pos, proj.pos))
      alien.vel.x += dir.x * PHYSICS.projectile.knockback
      alien.vel.y += dir.y * PHYSICS.projectile.knockback

      proj.alive = false

      if (alien.hp <= 0) {
        alien.alive = false
        newExplosions.push(createExplosion(alien.pos.x, alien.pos.y, explosionColor))
        kills++
      }

      break
    }
  }

  return { newExplosions, kills }
}

export function updateExplosions(explosions: Explosion[]): void {
  for (const exp of explosions) {
    let anyAlive = false
    for (const p of exp.particles) {
      if (p.life > 0) {
        p.life--
        anyAlive = true
      }
    }
    if (!anyAlive) exp.alive = false
  }
}
