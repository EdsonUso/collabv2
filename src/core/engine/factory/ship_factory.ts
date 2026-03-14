import type { Ship } from "../entities/types";
import { PHYSICS } from "../simulation_config";


let shipId = 1000;

export function createShip(x: number, y: number): Ship {
    return {
        id: ++shipId,
        type: "ship",
        pos: { x, y },
        vel: { x: 0, y: 0 },
        radius: 20,
        mass: 2,
        rotation: -Math.PI / 2,
        targetRotation: -Math.PI / 2,
        fireTimer: 0,
        alive: true,
        engineFlicker: 0,
        hp: PHYSICS.ship.hp,
        flash: 0,
        shield: 0,
    }
}