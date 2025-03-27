"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../contexts/theme-context"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="flex items-center justify-between w-full px-3 py-2">
            <span className="text-sm text-(--color-foreground)/80">Dark Mode</span>
            <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-(--color-foreground)/20"
            />
        </div>
    )
}
