"use client"

import { useState } from "react"
import { LogOut, Search, ShoppingCart, User, Heart, LogInIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../contexts/cart-context"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "../contexts/auth-context"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, ClipboardList, Key, ThumbsUp } from "lucide-react"

// Mock game data - replace with real API call in production
const games = [
    { id: 1, title: "Cyber Adventures 2077", price: "$59.99" },
    { id: 2, title: "Mystic Quest Legends", price: "$49.99" },
    { id: 3, title: "Space Warriors III", price: "$39.99" },
    { id: 4, title: "Dragon's Keep", price: "$29.99" },
    { id: 5, title: "Racing Evolution 2025", price: "$44.99" },
    { id: 6, title: "Medieval Kingdom", price: "$34.99" },
    { id: 7, title: "Zombie Survival", price: "$24.99" },
    { id: 8, title: "Pirate's Adventure", price: "$19.99" },
];

export default function Header() {
    const { cart } = useCart()
    const navigate = useNavigate()
    const [showAllResults, setShowAllResults] = useState(false)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)


    const { user, isAuthenticated, logout } = useAuth()

    const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0)



    const isActive = (path) =>
        location.pathname === path
            ? "text-(--color-accent-secondary) underline underline-offset-4 decoration-2"
            : "hover:text-(--color-foreground)";


    return (
        <header className="sticky top-0 z-50 bg-(--color-background)/50 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-(--color-foreground) mr-10">
                        <div className="flex">
                            <img src="/src/assets/imgs/logo/1.png" className="w-10" alt="GameVault Logo" />
                            <h1 className="text-(--color-accent-secondary)">Game</h1>Vault
                        </div>
                    </Link>

                    <nav className="hidden md:flex flex-1 items-center gap-8 text-(--color-foreground) ">
                        <Link to="/" className={isActive("/")}>Home</Link>
                        <Link to="/explore" className={isActive("/explore")}>Explore</Link>
                    </nav>

                    <nav className="hidden md:flex  items-center gap-8 text-(--color-foreground)  pr-4 ">
                        <Link to="/" >Genres</Link>
                        <Link to="/explore">Themes</Link>
                    </nav>
                    <div className="h-6 border-1 border-(--color-foreground)/80   mx-2"></div>


                    <div className="flex items-center space-x-4">
                        <Link to="/search">
                            <Button variant="ghost" size="icon" className="md:hidden text-(--color-foreground)">
                                <Search className="h-5 w-5" />
                            </Button>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-(--color-foreground) h-8 px-2 rounded bg-transparent hover:bg-(--color-foreground)/10 focus:outline-none">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-(--color-foreground)/10 text-(--color-foreground)">
                                            {user?.username?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                        <span className="truncate max-w-[100px] text-(--color-foreground)/80">{user?.username}</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-56 bg-(--color-background) text-(--color-light-ed)/80"
                                    >
                                        <div className="px-3 py-2 text-sm">
                                            <p className="font-medium">{user?.username}</p>
                                            <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
                                        </div>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem
                                            className="cursor-pointer focus:bg-(--color-foreground)/5"
                                            onClick={() => navigate("/cart")}
                                        >
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            <span>Cart</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem className="cursor-pointer focus:bg-(--color-foreground)/5" onClick={() => navigate("/inventory")}>
                                            <Key className="mr-2 h-4 w-4" />
                                            <span>Inventory</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem className="cursor-pointer focus:bg-(--color-foreground)/5">
                                            <ClipboardList className="mr-2 h-4 w-4" />
                                            <span>Order History</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="cursor-pointer focus:bg-(--color-foreground)/5"
                                            onClick={() => navigate("/wishlist")}
                                        >
                                            <Heart className="mr-2 h-4 w-4" />
                                            <span>Wishlist</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem className="cursor-pointer focus:bg-(--color-foreground)/5">
                                            <ThumbsUp className="mr-2 h-4 w-4" />
                                            <span>Customer Support</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem className="cursor-pointer focus:bg-(--color-foreground)/5">
                                            <Bell className="mr-2 h-4 w-4" />
                                            <span>Notifications</span>
                                        </DropdownMenuItem>

                                        <ThemeToggle />

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem className="cursor-pointer focus:bg-(--color-foreground)/5">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Account settings</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="cursor-pointer focus:bg-(--color-foreground)/5 flex justify-between items-center"
                                            onClick={logout}
                                        >
                                            <span>Sign out</span>
                                            <LogOut className="h-4 w-4 ml-2" />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-(--color-foreground) h-8 px-5 rounded bg-transparent hover:bg-(--color-foreground)/10 focus:outline-none">

                                    <Button variant="ghost" size="icon" className="text-(--color-foreground)">
                                        <User className="h-5 w-5" />
                                        Login
                                    </Button>

                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56 bg-(--color-background) text-(--color-light-ed)/80"
                                >


                                    <DropdownMenuItem
                                        className="cursor-pointer focus:bg-(--color-foreground)/5"
                                        onClick={() => navigate("/cart")}
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        <span>Cart</span>
                                    </DropdownMenuItem>


                                    <ThemeToggle />

                                    <DropdownMenuSeparator />


                                    <Link to="/login">
                                        <DropdownMenuItem
                                            className="cursor-pointer focus:bg-(--color-foreground)/5 flex justify-between items-center "
                                        >
                                            <span>Login</span>
                                            <LogInIcon className="h-4 w-4 ml-2" />

                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}