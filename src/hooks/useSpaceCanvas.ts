import { GameEngine } from "@/core/engine/game_engine";
import { useCallback, useEffect, useRef, useState } from "react";

export interface SpaceCanvasState {
    canvasRef: React.RefObject<HTMLCanvasElement | null >
    gameMode: boolean
    score: number
    shipHP: number
}

export function useSpaceCanvas(): SpaceCanvasState {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<GameEngine | null>(null);

    const [gameMode, setGameMode] = useState(false);
    const [score, setScore] = useState(0);
    const [shipHP, setShipHP] = useState(5);

    const onScoreChange = useCallback((s: number) => setScore(s), []);
    const onGameModeChange = useCallback((active: boolean) => setGameMode(active), [])
    const onShipHPChange = useCallback((hp: number) => setShipHP(hp), [])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const engine = new GameEngine(canvas, {
            onScoreChange, 
            onGameModeChange, 
            onShipHPChange
        });

        engineRef.current = engine
        engine.start()

        return () => {
            engine.destroy();
            engineRef.current = null;
        };
    }, [onScoreChange, onGameModeChange, onShipHPChange]);

    return {canvasRef, gameMode, score, shipHP}

}