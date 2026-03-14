import type { DragState } from "..";
import type { Alien } from "../entities/types";
import { clampSpeed } from "../physics_engine";
import { PHYSICS } from "../simulation_config";
import { vec2, type Vec2 } from "../vec2";

export function tryStartDrag(
    mousePos: Vec2,
    aliens: Alien[],
    drag: DragState
) : boolean {
    for (const alien of aliens) {
        if (!alien.alive) continue;
        if(vec2.dist(mousePos, alien.pos) < alien.radius + 10) {
            drag.active = true
            drag.entityId = alien.id
            drag.offset = vec2.sub(alien.pos, mousePos);
            drag.velocity = vec2.zero();
            alien.vel = vec2.zero();
            return true;
        }
    }
    return false;
}


export function updateDrag(
    mousePos: Vec2,
    aliens: Alien[],
    drag: DragState
): void {
    if (!drag.active || drag.entityId === null) return;

    //TODO: Procurar uma forma dessa bosta de busca O(N) passar a ser O(1), 
    //provavelmente vai precisar de uma reestruturação completa.
    const alien = aliens.find(a => a.id === drag.entityId);
    if (!alien || !alien.alive) {
        releaseDrag(aliens, drag)
        return;
    }

    const newPos = vec2.add(mousePos, drag.offset);
    drag.velocity = {
        x: (newPos.x - alien.pos.x) * 0.6,
        y: (newPos.y - alien.pos.y) * 0.6
    };
    alien.pos = newPos;
}


export function releaseDrag(aliens: Alien[], drag: DragState): void {
    if (!drag.active) return;

    if (drag.entityId !== null) {
        const alien = aliens.find(a => a.id === drag.entityId);
        if(alien) {
            alien.vel = vec2.mul(drag.velocity, PHYSICS.throwMultiplier);
            clampSpeed(alien);
        }
    }

    drag.active = false;
    drag.entityId = null;
    drag.offset = vec2.zero();
    drag.velocity = vec2.zero();
}