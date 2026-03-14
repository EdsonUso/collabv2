import type { Alien } from "../entities/types";
import { createAlien } from "../factory/alien_factory";
import { PHYSICS, type AlienType } from "../simulation_config";

export function checkAndSpawn(
    aliens: Alien[],
    respawnTimer: number,
    canvasW: number,
    canvasH: number
): { newAliens: Alien[]; newTimer: number } {
    const aliveCount: number = aliens.filter(a => a.alive).length

    if (aliveCount >= PHYSICS.spawn.minAliveCount) {
        return { newAliens: [], newTimer: 0 };
    }

    const newTimer = respawnTimer + 1;

    if(newTimer < PHYSICS.spawn.respawnDelay) {
        return { newAliens: [], newTimer };
    }

    const edge = Math.floor(Math.random() * 4);
    const margin = PHYSICS.spawn.edgeMargin;
    let x: number, y: number;

    switch (edge) {
        case 0: x = Math.random() * canvasW; y = -margin; break;
        case 1: x = canvasW + margin; y = Math.random() * canvasH; break;
        case 2: x = Math.random() * canvasW; y = canvasH + margin; break;
        default: x = -margin; y = Math.random() * canvasH; break;
    }

    const alienType = (Math.floor(Math.random() * 4)) as AlienType;
    return {
        newAliens: [createAlien(x, y, alienType)],
        newTimer: 0
    };
}