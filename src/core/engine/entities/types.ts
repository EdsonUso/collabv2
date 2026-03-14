import type { AlienType } from "../simulation_config";
import type { Vec2 } from "../vec2";

export interface BaseEntity {
    id: number;
    pos: Vec2;
    vel: Vec2;
    radius: number;
    mass: number;
    alive: boolean
}

export interface AlienEyes {
    blinkTimer: number;
    blinkDuration: number;
    lookAngle: number;
}

export interface Alien extends BaseEntity {
    type: "alien";
    alienType: AlienType
    rotation: number;
    rotationSpeed: number;
    driftTimer: number;
    hp: number;
    flash: number;
    eyes: AlienEyes;
}

export interface Ship extends BaseEntity {
    type: "ship"
    rotation: number;
    targetRotation: number;
    fireTimer: number;
    engineFlicker: number;
    hp:number;
    flash:number
    shield: number;
}

export interface ProjectileTrailPoint {
    x: number;
    y: number;
}

export interface Projectile extends BaseEntity {
    type: "projectile"
    life: number;
    owner: "ship" | "player"
    trail: ProjectileTrailPoint[];
}

export interface Star {
    x: number;
    y: number;
    size: number;
    brightness: number;
    thinkleSpeed: number;
    twinkOffset: number;
    layer: 0 | 1 | 2;
}

export interface ExplosionParticle {
    vel: Vec2;
    life: number;
    maxLife: number;
    size: number
}

export interface Explosion {
    pos: Vec2;
    particles: ExplosionParticle[];
    color: string;
    alive: boolean;
}

export type PhysicsEntity = Alien | Ship | Projectile;