"use client"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "../contexts/theme-context"

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative text-foreground"
            aria-label="Toggle theme"
        >
            <Sun className={`text-(--color-foreground) h-5 w-5 transition-all ${theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"}`} />
            <Moon
                className={`text-(--color-foreground) absolute h-5 w-5 transition-all ${theme === "light" ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
            />
        </Button>
    )
}

