import { GameHUD } from "@/components/Login/GameHUD";
import LoginForm from "@/components/Login/LoginForm";
import { useSpaceCanvas } from "@/hooks/useSpaceCanvas";

export default function LoginPage() {
    const { canvasRef, gameMode, score, shipHP } = useSpaceCanvas();

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 0,
                }}
            />
            {gameMode ? (
                <GameHUD score={score} shipHP={shipHP} />
            ) : (
                <LoginForm />
            )}
        </>
    )
}