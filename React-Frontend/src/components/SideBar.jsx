"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    ShoppingCart,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Gamepad2,
    HelpCircle,
    Bell,
    Plus,
    Gift,
    Menu,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "../contexts/auth-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const [mounted, setMounted] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check if sidebar state is saved in localStorage
        const savedState = localStorage.getItem("sidebarCollapsed")
        if (savedState !== null) {
            setCollapsed(savedState === "true")
        }

        // Check if we're on mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => {
            window.removeEventListener("resize", checkMobile)
        }
    }, [])

    const toggleSidebar = () => {
        const newState = !collapsed
        setCollapsed(newState)
        localStorage.setItem("sidebarCollapsed", String(newState))
    }

    const { user, logout } = useAuth()

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
            badge: null,
        },
        {
            title: "Promo Codes",
            icon: <Gift size={20} />,
            path: "/admin/promo-codes",
            badge: null,
        },
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

    const SidebarContent = () => (
        <>
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
                <div className={cn("flex flex-col", collapsed && !isMobile && "hidden")}>
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
                    {(!collapsed || isMobile) && (
                        <div className="flex flex-col">
                            <span className="font-medium text-sm text-(--color-foreground)">{user?.username || "Admin"}</span>
                            <span className="text-xs text-(--color-muted-foreground)">{user?.email || "admin@example.com"}</span>
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
                                        onClick={isMobile ? () => document.body.click() : undefined}
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
                                        {(!collapsed || isMobile) && <span className="truncate">{item.title}</span>}
                                        {(!collapsed || isMobile) && item.badge && (
                                            <Badge variant={location.pathname === item.path ? "outline" : "secondary"} className="ml-auto">
                                                {item.badge}
                                            </Badge>
                                        )}
                                        {collapsed && !isMobile && item.badge && (
                                            <Badge
                                                variant="secondary"
                                                className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Link>
                                </TooltipTrigger>
                                {collapsed && !isMobile && (
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
                            .filter((item) => item.title !== "Logout")
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
                                            onClick={isMobile ? () => document.body.click() : undefined}
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
                                            {(!collapsed || isMobile) && <span className="truncate">{item.title}</span>}
                                            {(!collapsed || isMobile) && item.badge && (
                                                <Badge variant={location.pathname === item.path ? "outline" : "secondary"} className="ml-auto">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                            {collapsed && !isMobile && item.badge && (
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    </TooltipTrigger>
                                    {collapsed && !isMobile && (
                                        <TooltipContent side="right" className="font-medium">
                                            {item.title}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            ))}

                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => {
                                        logout()
                                        if (isMobile) document.body.click()
                                    }}
                                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-(--color-accent)/50 text-(--color-foreground)"
                                >
                                    <span className="flex-shrink-0 text-(--color-muted-foreground) group-hover/item:text-(--color-foreground)">
                                        <LogOut size={20} />
                                    </span>
                                    {(!collapsed || isMobile) && <span className="truncate">Logout</span>}
                                </button>
                            </TooltipTrigger>
                            {collapsed && !isMobile && (
                                <TooltipContent side="right" className="font-medium">
                                    Logout
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </nav>
                </TooltipProvider>
            </div>
        </>
    )

    // For mobile, render a Sheet component
    if (isMobile) {
        return (
            <>
                <div className="fixed top-4 left-4 z-40">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="bg-(--color-background) border-(--color-border)/40 " >
                                <Menu className="h-5 w-5 text-(--color-foreground) " />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="p-0 w-[280px] bg-gradient-to-b from-(--color-background) to-(--color-background)/80 border-r border-(--color-border)/40 text-white"
                        >
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </div>
            </>
        )
    }

    // For desktop, render the regular sidebar
    return (
        <div
            className={cn(
                "flex flex-col h-screen bg-gradient-to-b from-(--color-background) to-(--color-background)/80 border-r border-(--color-border)/40 shadow-lg transition-all duration-300 relative group",
                collapsed ? "w-[70px]" : "w-[250px]",
            )}
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute text-white -right-3 top-6 h-6 w-6 rounded-full border-1 border-(--color-border)/100 bg-(--color-background) shadow-md hover:bg-(--color-foreground) hover:text-(--color-alt-foreground) z-10"
                onClick={toggleSidebar}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </Button>

            <SidebarContent />
        </div>
    )
}

export default Sidebar
