export const PHYSICS = {
  damping: 0.995,
  throwMultiplier: 1.8,
  collisionElasticity: 0.85,
  boundaryBounce: 0.7,
  maxSpeed: 12,

  alien: {
    driftForce: 0.008,
    rotationSpeed: 0.01,
    baseHP: 3,
    baseRadius: { min: 18, max: 28 },
    baseMass: { min: 1, max: 1.5 },
  },

  ship: {
    aiSpeed: 1.2,
    playerAccel: 0.24,
    aiEngageDistance: 400,
    aiKeepDistance: { min: 100, max: 200 },
    aiRotationLerp: 0.05,
    aiFireRate: 90,
    playerFireRate: 12,
    hp: 5,
  },

  projectile: {
    speed: 7,
    maxLife: 180,
    radius: 3,
    trailLength: 8,
    knockback: 3,
  },

  spawn: {
    minAliveCount: 3,
    respawnDelay: 120,
    edgeMargin: 30,
  },
} as const;

export const GAME_CONFIG = {
  targetFPS: 60,
  starDensity: 700,
  alienDensity: 40000,
  scorePerKill: 100,
} as const;

export type AlienType = 0 | 1 | 2 | 3;
