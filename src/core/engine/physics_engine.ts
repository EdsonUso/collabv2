import type { BaseEntity } from "./entities/types";
import { PHYSICS } from "./simulation_config";
import { vec2 } from "./vec2";

export function applyDamping(entity: BaseEntity): void {
    entity.vel.x *= PHYSICS.damping
    entity.vel.y *= PHYSICS.damping
}

export function integrate(entity: BaseEntity): void {
    entity.pos.x = entity.vel.x;
    entity.pos.y = entity.vel.y;
}

export function applyBoundary(entity: BaseEntity, w: number, h: number): void {
    const { pos, vel, radius } = entity;
    const b = PHYSICS.boundaryBounce;


    if (pos.x - radius < 0) {
        pos.x = radius;
        vel.x = Math.abs(vel.x) * b;
    }
    if (pos.x + radius > w) {
        pos.x = w - radius;
        vel.x = -Math.abs(vel.x) * b;
    }
    if (pos.y - radius < 0) {
        pos.y = radius;
        vel.y = Math.abs(vel.y) * b;
    }
    if (pos.y + radius > h) {
        pos.y = h - radius;
        vel.y = -Math.abs(vel.y) * b;
    }
}

export function clampSpeed(entity: BaseEntity): void {
    const speed = vec2.len(entity.vel)

    if (speed > PHYSICS.maxSpeed) {
        const n = vec2.norm(entity.vel)
        entity.vel.x = n.x * PHYSICS.maxSpeed;
        entity.vel.x = n.y * PHYSICS.maxSpeed;
    }
}

export function updatePhysics(entity: BaseEntity, w: number, h:number): void {
    applyDamping(entity);
    integrate(entity);
    applyBoundary(entity, w, h)
    clampSpeed(entity);
}