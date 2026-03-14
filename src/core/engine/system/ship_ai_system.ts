
import type { Alien, Projectile, Ship } from "../entities/types";
import { createProjectile } from "../factory/projectile_factory";
import { PHYSICS } from "../simulation_config";
import { vec2 } from "../vec2";

interface AIContext {
    ship: Ship;
    aliens: Alien[];
    projectiles: Projectile[]
    canvasW: number;
    canvasH: number;
}

/* Executa um tick */
export function updateShipAI(ctx: AIContext): Projectile[] {
    const { ship, aliens, canvasW, canvasH } = ctx;
    const newProjectiles: Projectile[] = []

    if (!ship.alive) return newProjectiles;

    const aliveAliens = aliens.filter(a => a.alive)

    if (aliveAliens.length === 0) {
        const center = { x: canvasW / 2, y: canvasH / 2 };
        const toCenter = vec2.sub(center, ship.pos)
        const d = vec2.len(toCenter);
        if (d > 150) {
            const dir = vec2.norm(toCenter)
            ship.vel.x += dir.x * 0.02;
            ship.vel.y += dir.y * 0.02;
        }

        return newProjectiles
    }

    const sorted = aliveAliens
        .map(alien => ({
            alien,
            dist: vec2.dist(ship.pos, alien.pos),
        }))
        .sort((a, b) => a.dist - b.dist);

    const nearest = sorted[0];
    const toTarget = vec2.sub(nearest.alien.pos, ship.pos);
    const targetAngle = Math.atan2(toTarget.y, toTarget.x);

    let angleDiff = targetAngle - ship.rotation;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    ship.rotation += angleDiff * PHYSICS.ship.aiRotationLerp;


    const { aiKeepDistance, aiSpeed } = PHYSICS.ship;
    if (nearest.dist > aiKeepDistance.max) {
        const dir = vec2.norm(toTarget);
        ship.vel.x += dir.x * aiSpeed * 0.03;
        ship.vel.y += dir.y * aiSpeed * 0.03;
    } else if (nearest.dist < aiKeepDistance.min) {
        const dir = vec2.norm(toTarget)
        ship.vel.x -= dir.x * aiSpeed * 0.02;
        ship.vel.y -= dir.y * aiSpeed * 0.02;
    }

    ship.fireTimer--;
    if(ship.fireTimer <= 0 && nearest.dist < PHYSICS.ship.aiEngageDistance) {
        const dir = vec2.norm(toTarget);
        const spread = (Math.random() - 0.5) * 0.1;
        const rotDir = vec2.rotate(dir, spread);

        newProjectiles.push(
            createProjectile(
                ship.pos.x + dir.x * 25,
                ship.pos.y + dir.y * 25,
                rotDir.x * PHYSICS.projectile.speed + ship.vel.x * 0.5,
                rotDir.y * PHYSICS.projectile.speed + ship.vel.y * 0.5,
                "ship"
            )
        );
        ship.fireTimer = PHYSICS.ship.aiFireRate;
    }

    return newProjectiles;
}


