import type { Alien } from "../entities/types";
import { PHYSICS, type AlienType } from "../simulation_config";

let nextId = 0;
export const resetAlienIdCounter = () => { nextId = 0 };

export function createAlien(x: number, y: number, alienType: AlienType): Alien {
    const { baseRadius, baseMass, rotationSpeed } = PHYSICS.alien;

    return {
        id: ++nextId,
        type: "alien",
        alienType,
        pos: { x, y },
        vel: {
            x: (Math.random() - 0.5) * 0.6,
            y: (Math.random() - 0.5) * 0.6,
        },
        radius: baseRadius.min + Math.random() * (baseRadius.max - baseRadius.min),
        mass: baseMass.min + Math.random() * (baseMass.max - baseMass.min),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * rotationSpeed * 2,
        driftTimer: Math.random() * 200,
        hp: PHYSICS.alien.baseHP,
        flash: 0,
        alive: true,
        eyes: {
            blinkTimer: Math.random() * 300,
            blinkDuration: 0,
            lookAngle: 0,
        },
    };
}