import type { GameCallbacks, GameState } from "."
import { createAlien } from "./factory/alien_factory"
import { createExplosion, createStar } from "./factory/particle_factory"
import { createShip } from "./factory/ship_factory"
import { GameLoop } from "./game_loop"
import { InputManager } from "./input_manager"
import { updatePhysics } from "./physics_engine"
import { drawAllAliens } from "./render/alien_render"
import { drawBackground } from "./render/background_renderer"
import { drawAllExplosions } from "./render/explosion_render"
import { drawAllProjectiles } from "./render/projectile_renderer"
import { drawShip } from "./render/ship_render"
import { drawAllStars } from "./render/star_render"
import { GAME_CONFIG, PHYSICS, type AlienType } from "./simulation_config"
import { checkCircleCollision, processCollisions } from "./system/collision_system"
import { releaseDrag, tryStartDrag, updateDrag } from "./system/drag_system"
import { updatePlayerControl } from "./system/player_controls_system"
import { updateExplosions, updateProjectiles } from "./system/projectile_system"
import { updateShipAI } from "./system/ship_ai_system"
import { checkAndSpawn } from "./system/spawn_system"
import { ThemeReader } from "./theme_colors"
import { vec2 } from "./vec2"

export class GameEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null
  private loop: GameLoop
  private inputManager: InputManager
  private state: GameState
  private callbacks: GameCallbacks
  private score = 0
  private themeReader: ThemeReader

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.callbacks = callbacks
    this.themeReader = new ThemeReader()

    this.resizeCanvas()
    this.state = this.createInitialState()
    this.inputManager = new InputManager(canvas)
    this.wireInputCallbacks()
    this.loop = new GameLoop(() => this.tick())

    window.addEventListener("resize", this.handleResize)
  }

  start(): void {
    this.loop.start()
  }

  destroy(): void {
    this.loop.destroy()
    this.inputManager.destroy()
    this.themeReader.destroy()
    window.removeEventListener("resize", this.handleResize)
  }

  private createInitialState(): GameState {
    const rect = this.canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height

    const numAliens = Math.max(4, Math.floor((w * h) / GAME_CONFIG.alienDensity))
    const numStars = Math.floor((w * h) / GAME_CONFIG.starDensity)

    const aliens = []
    const margin = 60
    for (let i = 0; i < numAliens; i++) {
      aliens.push(
        createAlien(
          margin + Math.random() * (w - margin * 2),
          margin + Math.random() * (h - margin * 2),
          (i % 4) as AlienType
        )
      )
    }

    return {
      aliens,
      ship: createShip(w * 0.5, h * 0.5),
      projectiles: [],
      explosions: [],
      stars: Array.from({ length: numStars }, () => createStar(w, h)),
      time: 0,
      canvasW: w,
      canvasH: h,
      isGameMode: false,
      respawnTimer: 0,
    }
  }

  private wireInputCallbacks(): void {
    const im = this.inputManager

    im.onMouseDown = (x, y) => {
      if (this.state.isGameMode) return

      if (
        this.state.ship.alive &&
        vec2.dist({ x, y }, this.state.ship.pos) < 50
      ) {
        this.toggleGameMode()
        return
      }

      tryStartDrag({ x, y }, this.state.aliens, im.drag)
    }

    im.onMouseUp = () => {
      releaseDrag(this.state.aliens, this.inputManager.drag)
    }

    im.onEscape = () => {
      if (this.state.isGameMode) {
        this.state.isGameMode = false
        this.callbacks.onGameModeChange(false)
      }
    }
  }

  private toggleGameMode(): void {
    if (this.state.isGameMode) {
      this.exitGameMode()
    } else {
      this.state.isGameMode = true
      this.score = 0
      this.state.ship.hp = PHYSICS.ship.hp
      this.state.ship.alive = true
      this.state.ship.shield = 1
      this.callbacks.onScoreChange(0)
      this.callbacks.onShipHPChange(PHYSICS.ship.hp)
      this.callbacks.onGameModeChange(true)
    }
  }

  private exitGameMode(): void {
    this.state.isGameMode = false
    this.callbacks.onGameModeChange(false)

    if (!this.state.ship.alive) {
      const { canvasW: w, canvasH: h } = this.state
      this.state.ship = createShip(w * 0.5, h * 0.5)
    }
  }

  private handleResize = (): void => {
    this.resizeCanvas()
    const rect = this.canvas.getBoundingClientRect()
    this.state.canvasW = rect.width
    this.state.canvasH = rect.height
  }

  private resizeCanvas(): void {
    if (!this.ctx) return
    const dpr = window.devicePixelRatio || 1
    const rect = this.canvas.getBoundingClientRect()
    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  private tick(): void {
    const ctx = this.ctx
    if (!ctx) return

    const s = this.state
    const { input, drag } = this.inputManager
    const { canvasW: w, canvasH: h } = s
    const palette = this.themeReader.palette

    s.time++

    if (drag.active) {
      updateDrag(input.mouse, s.aliens, drag)
    }

    for (const alien of s.aliens) {
      if (!alien.alive) continue
      if (drag.entityId === alien.id) continue

      alien.driftTimer += 1
      alien.vel.x +=
        Math.sin(alien.driftTimer * 0.01 + alien.id) * PHYSICS.alien.driftForce
      alien.vel.y +=
        Math.cos(alien.driftTimer * 0.012 + alien.id * 1.3) * PHYSICS.alien.driftForce

      alien.rotation += alien.rotationSpeed

      updatePhysics(alien, w, h)

      if (alien.flash > 0) alien.flash -= 0.05

      alien.eyes.blinkTimer--
      if (alien.eyes.blinkTimer <= 0) {
        if (alien.eyes.blinkDuration > 0) {
          alien.eyes.blinkDuration--
          if (alien.eyes.blinkDuration <= 0) {
            alien.eyes.blinkTimer = 150 + Math.random() * 200
          }
        } else {
          alien.eyes.blinkDuration = 5 + Math.random() * 5
        }
      }
      alien.eyes.lookAngle += (Math.random() - 0.5) * 0.05
    }

    const aliveAliens = s.aliens.filter((a) => a.alive)
    processCollisions(aliveAliens)

    if (s.isGameMode && s.ship.alive && s.ship.shield <= 0) {
      for (const alien of aliveAliens) {
        if (checkCircleCollision(s.ship, alien)) {
          s.ship.hp--
          s.ship.flash = 1
          s.ship.shield = 1
          this.callbacks.onShipHPChange(s.ship.hp)

          const dir = vec2.norm(vec2.sub(s.ship.pos, alien.pos))
          s.ship.vel.x += dir.x * 5
          s.ship.vel.y += dir.y * 5

          if (s.ship.hp <= 0) {
            s.ship.alive = false
            s.explosions.push(
              createExplosion(s.ship.pos.x, s.ship.pos.y, palette.primary)
            )
            this.exitGameMode()
            break
          }
        }
      }
    }

    if (s.ship.alive) {
      let newProjectiles
      if (s.isGameMode) {
        newProjectiles = updatePlayerControl(s.ship, input)
      } else {
        newProjectiles = updateShipAI({
          ship: s.ship,
          aliens: s.aliens,
          projectiles: s.projectiles,
          canvasW: w,
          canvasH: h,
        })
      }
      s.projectiles.push(...newProjectiles)

      updatePhysics(s.ship, w, h)
      s.ship.engineFlicker += 0.3
      if (s.ship.flash > 0) s.ship.flash -= 0.05
      if (s.ship.shield > 0) s.ship.shield -= 0.01
    }

    const { newExplosions, kills } = updateProjectiles(
      s.projectiles,
      s.aliens,
      w,
      h,
      palette.primary
    )
    s.explosions.push(...newExplosions)

    if (kills > 0 && s.isGameMode) {
      this.score += kills * GAME_CONFIG.scorePerKill
      this.callbacks.onScoreChange(this.score)
    }

    updateExplosions(s.explosions)

    const spawnResult = checkAndSpawn(s.aliens, s.respawnTimer, w, h)
    s.aliens.push(...spawnResult.newAliens)
    s.respawnTimer = spawnResult.newTimer

    s.projectiles = s.projectiles.filter((p) => p.alive)
    s.explosions = s.explosions.filter((e) => e.alive)

    drawBackground(ctx, w, h, palette)
    drawAllStars(ctx, s.stars, s.time, palette)
    drawAllAliens(ctx, s.aliens, s.time, palette)
    drawAllProjectiles(ctx, s.projectiles, palette)
    drawShip(ctx, s.ship, s.time, s.isGameMode, palette)
    drawAllExplosions(ctx, s.explosions)

    if (drag.active && drag.entityId !== null) {
      const entity = s.aliens.find((a) => a.id === drag.entityId)
      if (entity) {
        ctx.globalAlpha = 0.4
        ctx.strokeStyle = palette.primary
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.arc(entity.pos.x, entity.pos.y, entity.radius + 8, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }
    }
  }
}
