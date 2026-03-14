export class GameLoop {
    private animId: number | null = null;
    private running = false;
    private callback: (time: number) => void;

    constructor (callback: (time: number) => void) {
        this.callback = callback
    }

    start(): void {
        if (this.running) return;
        this.running = true;
        this.tick()
    }

    stop(): void {
        this.running = false
        if (this.animId !== null) {
            cancelAnimationFrame(this.animId)
            this.animId = null;
        }
    }

    destroy(): void {
        this.stop()
    }

    private tick = (): void => {
        if (!this.running) return;
        this.callback(performance.now());
        this.animId = requestAnimationFrame(this.tick)
    }
}