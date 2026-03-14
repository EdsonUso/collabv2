import type { Alien, Explosion, Projectile, Ship, Star } from "./entities/types";
import type { Vec2 } from "./vec2";

export interface GameState {
  aliens: Alien[];
  ship: Ship;
  projectiles: Projectile[];
  explosions: Explosion[];
  stars: Star[];
  time: number;
  canvasW: number;
  canvasH: number;
  isGameMode: boolean;
  respawnTimer: number;
}
 
export interface InputState {
  mouse: Vec2;
  mouseDown: boolean;
  keys: Record<string, boolean>;
}
 
export interface DragState {
  active: boolean;
  entityId: number | null;
  offset: Vec2;
  velocity: Vec2;
}
 
export interface GameCallbacks {
  onScoreChange: (score: number) => void;
  onGameModeChange: (active: boolean) => void;
  onShipHPChange: (hp: number) => void;
}