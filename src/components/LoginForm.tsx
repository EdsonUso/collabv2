import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function LoginForm() {
    const [email, setEmail] =  useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
    }


    return (
        <div className="min-h-screen bg-background overflow-hidden flex items-center justify-center">
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>
        </div>
    )
}