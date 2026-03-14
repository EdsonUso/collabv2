import type { BaseEntity } from "./entities/types";
import { PHYSICS } from "./simulation_config";

export function checkCircleCollision(a: BaseEntity, b: BaseEntity): boolean {
    const dx = b.pos.x - a.pos.x;
    const dy = b.pos.y - a.pos.y;
    const distSq = dx * dx + dy * dy
    const minDist = a.radius + b.radius
    return distSq < minDist * minDist; // se for menor que a soma da circunferencia de ambos a colisão
}

export function resolveElasticCollision(a: BaseEntity, b: BaseEntity): void {
    const dx = b.pos.x - a.pos.x;
    const dy = b.pos.y - a.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) return;

    const nx = dx / dist;
    const ny = dy / dist;

    const overlap = a.radius + b.radius - dist;
    if (overlap > 0) {
        const totalMass = a.mass + b.mass;
        a.pos.x -= nx * overlap * (b.mass / totalMass)
        a.pos.y -= ny * overlap * (b.mass / totalMass);
        b.pos.x += nx * overlap * (a.mass / totalMass);
        b.pos.y += ny * overlap * (a.mass / totalMass);
    }

    const dvx = a.vel.x - b.vel.x;
    const dvy = a.vel.y - b.vel.y;
    const dvDotN = dvx * nx + dvy * ny;

    if (dvDotN <= 0) return;

    const e = PHYSICS.collisionElasticity;
    const j = (-(1 + e) * dvDotN) / (1 / a.mass + 1 / b.mass)

    a.vel.x += (j / a.mass) * nx;
    a.vel.y += (j / a.mass) * ny;
    b.vel.x += (j / b.mass) * nx;
    b.vel.y += (j / b.mass) * ny;
}

function processCollisions(entities: BaseEntity[]): void {
    for (let i = 0; i < entities.length; i++) {
        for(let j = i + 1; j < entities.length; j++){
            if(checkCircleCollision(entities[i], entities[j])) {
                resolveElasticCollision(entities[i], entities[j])
            }
        }
    }
}