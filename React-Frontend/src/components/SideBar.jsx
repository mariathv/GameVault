"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Gamepad2,
    BarChart3,
    Boxes,
    CreditCard,
    HelpCircle,
    Bell,
    Plus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "../contexts/auth-context"

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check if sidebar state is saved in localStorage
        const savedState = localStorage.getItem("sidebarCollapsed")
        if (savedState !== null) {
            setCollapsed(savedState === "true")
        }
    }, [])

    const toggleSidebar = () => {
        const newState = !collapsed
        setCollapsed(newState)
        localStorage.setItem("sidebarCollapsed", String(newState))
    }

    const { user, logout } = useAuth();


    // Only render the component after it's mounted to avoid hydration issues
    if (!mounted) return null

    const menuItems = [
        {
            title: "Dashboard",
            icon: <LayoutDashboard size={20} />,
            path: "/admin",
            badge: null,
        },
        {
            title: "Add a Game",
            icon: <Plus size={20} />,
            path: "/admin/add-a-game",
            badge: null,
        },
        {
            title: "Store Games",
            icon: <Gamepad2 size={20} />,
            path: "/admin/view-games",
            badge: null,
        },
        {
            title: "Purchases",
            icon: <ShoppingCart size={20} />,
            path: "/admin/purchases",
            badge: "12",
        },
        {
            title: "Users",
            icon: <Users size={20} />,
            path: "/admin/users",
            badge: null,
        },
        // {
        //     title: "Analytics",
        //     icon: <BarChart3 size={20} />,
        //     path: "/admin/analytics",
        //     badge: null,
        // },
    ]

    const bottomMenuItems = [
        {
            title: "Notifications",
            icon: <Bell size={20} />,
            path: "/admin/notifications",
            badge: "3",
        },
        {
            title: "Help",
            icon: <HelpCircle size={20} />,
            path: "/admin/help",
            badge: null,
        },
        {
            title: "Settings",
            icon: <Settings size={20} />,
            path: "/admin/settings",
            badge: null,
        },
        {
            title: "Logout",
            icon: <LogOut size={20} />,
            path: "/logout",
            badge: null,
        },
    ]

    return (
        <div
            className={cn(
                "flex flex-col h-screen bg-gradient-to-b from-(--color-background) to-(--color-background)/80 border-r border-(--color-border)/40 shadow-lg transition-all duration-300 relative group",
                collapsed ? "w-[70px]" : "w-[250px]",
            )}
        >
            {/* Toggle button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute text-white -right-3 top-6 h-6 w-6 rounded-full border-1 border-(--color-border)/100 bg-(--color-background) shadow-md hover:bg-(--color-foreground) hover:text-(--color-alt-foreground) z-10"
                onClick={toggleSidebar}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </Button>

            {/* Logo and header */}
            <div className="p-4 flex items-center gap-2">
                <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-(--color-foreground)/10 text-(--color-foreground)">
                    <Gamepad2 size={24} className="text-(--color-foreground)" />
                    <div className="absolute -top-1 -right-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--color-foreground) opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-(--color-foreground)"></span>
                        </span>
                    </div>
                </div>
                <div className={cn("flex flex-col", collapsed && "hidden")}>
                    <label className="font-bold text-lg text-(--color-foreground)">GameVault</label>
                    <label className="text-xs text-(--color-muted-foreground)">Admin Portal</label>
                </div>
            </div>

            <Separator className="my-2 opacity-50" />

            {/* User profile */}
            <div className="px-3 py-2 cursor-default">
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-(--color-accent)/50 transition-colors">
                    <Avatar className="h-9 w-9 border-2 border-(--color-foreground)/20">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                        <AvatarFallback className="bg-(--color-foreground)/10 text-(--color-foreground) font-medium">
                            AD
                        </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="font-medium text-sm text-(--color-foreground)">{user.username}</span>
                            <span className="text-xs text-(--color-muted-foreground)">{user.email}</span>
                        </div>
                    )}
                </div>
            </div>

            <Separator className="my-2 opacity-50" />

            {/* Main navigation */}
            <div className="flex-1 overflow-auto py-2 px-3">
                <TooltipProvider delayDuration={0}>
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <Tooltip key={item.path} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        to={item.path}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors relative group/item",
                                            location.pathname === item.path
                                                ? "bg-(--color-foreground) text-(--color-alt-foreground)"
                                                : "hover:bg-(--color-accent)/50 text-(--color-foreground)",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "flex-shrink-0",
                                                location.pathname === item.path
                                                    ? "text-(--color-alt-foreground)"
                                                    : "text-(--color-muted-foreground) group-hover/item:text-(--color-foreground)",
                                            )}
                                        >
                                            {item.icon}
                                        </span>
                                        {!collapsed && <span className="truncate">{item.title}</span>}
                                        {!collapsed && item.badge && (
                                            <Badge variant={location.pathname === item.path ? "outline" : "secondary"} className="ml-auto">
                                                {item.badge}
                                            </Badge>
                                        )}
                                        {collapsed && item.badge && (
                                            <Badge
                                                variant="secondary"
                                                className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Link>
                                </TooltipTrigger>
                                {collapsed && (
                                    <TooltipContent side="right" className="font-medium text-(--color-foreground)">
                                        {item.title}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        ))}
                    </nav>
                </TooltipProvider>
            </div>

            {/* Bottom navigation */}
            <div className="py-2 px-3">
                <Separator className="my-2 opacity-50" />
                <TooltipProvider delayDuration={0}>
                    <nav className="space-y-1">
                        {bottomMenuItems
                            .filter(item => item.title !== "Logout")
                            .map((item) => (
                                <Tooltip key={item.path} delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            to={item.path}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors relative group/item",
                                                location.pathname === item.path
                                                    ? "bg-(--color-foreground) text-(--color-alt-foreground)"
                                                    : "hover:bg-(--color-accent)/50 text-(--color-foreground)",
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "flex-shrink-0",
                                                    location.pathname === item.path
                                                        ? "text-(--color-alt-foreground)"
                                                        : "text-(--color-muted-foreground) group-hover/item:text-(--color-foreground)",
                                                )}
                                            >
                                                {item.icon}
                                            </span>
                                            {!collapsed && <span className="truncate">{item.title}</span>}
                                            {!collapsed && item.badge && (
                                                <Badge variant={location.pathname === item.path ? "outline" : "secondary"} className="ml-auto">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                            {collapsed && item.badge && (
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    </TooltipTrigger>
                                    {collapsed && (
                                        <TooltipContent side="right" className="font-medium">
                                            {item.title}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            ))}

                        {/* ✅ Custom Logout Button */}
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => {
                                        logout();
                                    }}
                                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-(--color-accent)/50 text-(--color-foreground)"
                                >
                                    <span className="flex-shrink-0 text-(--color-muted-foreground) group-hover/item:text-(--color-foreground)">
                                        <LogOut size={20} />
                                    </span>
                                    {!collapsed && <span className="truncate">Logout</span>}
                                </button>
                            </TooltipTrigger>
                            {collapsed && (
                                <TooltipContent side="right" className="font-medium">
                                    Logout
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </nav>
                </TooltipProvider>
            </div>

        </div>
    )
}

export default Sidebar



