import type { DragState, InputState } from ".";
import { vec2 } from "./vec2";

export class InputManager {
  readonly input: InputState;
  readonly drag: DragState;
 
  private canvas: HTMLCanvasElement;
  private listeners: Array<{
    target: EventTarget;
    event: string;
    handler: EventListener;
  }> = [];
 
  // Callbacks que o GameEngine conecta
  onMouseDown?: (x: number, y: number) => void;
  onMouseUp?: () => void;
  onRightClick?: (x: number, y: number) => void;
  onEscape?: () => void;
 
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
 
    this.input = {
      mouse: vec2.zero(),
      mouseDown: false,
      keys: {},
    };
 
    this.drag = {
      active: false,
      entityId: null,
      offset: vec2.zero(),
      velocity: vec2.zero(),
    };
 
    this.bindEvents();
  }
 
  private getCanvasPos(e: MouseEvent | Touch): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
 
  private on(target: EventTarget, event: string, handler: EventListener, opts?: AddEventListenerOptions): void {
    target.addEventListener(event, handler, opts);
    this.listeners.push({ target, event, handler });
  }
 
  private bindEvents(): void {
    // ── Mouse ──
    this.on(this.canvas, "mousedown", ((e: MouseEvent) => {
      if (e.button === 2) return;
      const pos = this.getCanvasPos(e);
      this.input.mouse = pos;
      this.input.mouseDown = true;
      this.onMouseDown?.(pos.x, pos.y);
    }) as EventListener);
 
    this.on(this.canvas, "mousemove", ((e: MouseEvent) => {
      const pos = this.getCanvasPos(e);
      this.input.mouse = pos;
    }) as EventListener);
 
    this.on(this.canvas, "mouseup", (() => {
      this.input.mouseDown = false;
      this.onMouseUp?.();
    }) as EventListener);
 
    this.on(this.canvas, "mouseleave", (() => {
      this.input.mouseDown = false;
      this.onMouseUp?.();
    }) as EventListener);
 
    this.on(this.canvas, "contextmenu", ((e: MouseEvent) => {
      e.preventDefault();
      const pos = this.getCanvasPos(e);
      this.onRightClick?.(pos.x, pos.y);
    }) as EventListener);
 
    // ── Keyboard ──
    this.on(window, "keydown", ((e: KeyboardEvent) => {
      this.input.keys[e.key.toLowerCase()] = true;
      if (e.key === "Escape") this.onEscape?.();
    }) as EventListener);
 
    this.on(window, "keyup", ((e: KeyboardEvent) => {
      this.input.keys[e.key.toLowerCase()] = false;
    }) as EventListener);
 
    // ── Touch ──
    this.on(this.canvas, "touchstart", ((e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        const pos = this.getCanvasPos(e.touches[0]);
        this.input.mouse = pos;
        this.input.mouseDown = true;
        this.onMouseDown?.(pos.x, pos.y);
      }
    }) as EventListener, { passive: false });
 
    this.on(this.canvas, "touchmove", ((e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        const pos = this.getCanvasPos(e.touches[0]);
        this.input.mouse = pos;
      }
    }) as EventListener, { passive: false });
 
    this.on(this.canvas, "touchend", (() => {
      this.input.mouseDown = false;
      this.onMouseUp?.();
    }) as EventListener);
  }
 
  /**
   * Remove todos os event listeners. Chamar no cleanup.
   */
  destroy(): void {
    for (const { target, event, handler } of this.listeners) {
      target.removeEventListener(event, handler);
    }
    this.listeners = [];
  }
}