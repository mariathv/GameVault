"use client"

import { useState } from "react"
import { LogOut, Search, ShoppingCart, User, Heart } from "lucide-react"
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

export default function Header({ searchQuery = "", setSearchQuery }) {
    const { cart } = useCart()
    const [query, setQuery] = useState(searchQuery)
    const navigate = useNavigate()
    const [showAllResults, setShowAllResults] = useState(false)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`)
            setIsDropdownVisible(false)
        }
    }

    const { user, isAuthenticated, logout } = useAuth()

    const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

    // Filter games based on search query
    const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase())
    )

    // Get either 5 results or all results based on showAllResults state
    const displayedGames = showAllResults ? filteredGames : filteredGames.slice(0, 5)

    const isActive = (path) => location.pathname === path ? "text-(--color-accent-primary)" : "hover:text-(--color-foreground)"

    return (
        <header className="sticky top-0 z-50 bg-(--color-background)/50 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-(--color-foreground) mr-10">
                        <div className="flex">
                            <img src="/src/assets/imgs/logo/1.png" className="w-10" alt="GameVault Logo" />
                            GameVault
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-(--color-foreground)">
                        <Link to="/" className={isActive("/")}>Home</Link>
                        <Link to="/explore" className={isActive("/explore")}>Explore</Link>
                    </nav>

                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
                        <div className="relative w-full max-w-lg">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-foreground)/60" />
                            <Input
                                type="search"
                                placeholder="Search games..."
                                className="!pl-10 w-full bg-foreground/5 border-(--color-foreground)/40 pl-10 text-(--color-foreground)"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value)
                                    setIsDropdownVisible(true)
                                    setShowAllResults(false)
                                }}
                                onFocus={() => setIsDropdownVisible(true)}
                            />

                            {/* Search Results Dropdown */}
                            {isDropdownVisible && query && (
                                <div className="absolute w-full mt-2 bg-(--color-background) rounded-lg shadow-lg border border-(--color-foreground)/10 z-50">
                                    {displayedGames.length > 0 ? (
                                        <>
                                            {displayedGames.map(game => (
                                                <div
                                                    key={game.id}
                                                    className="px-4 py-2 hover:bg-(--color-foreground)/5 cursor-pointer flex justify-between items-center text-(--color-foreground)"
                                                    onClick={() => {
                                                        setQuery(game.title)
                                                        setIsDropdownVisible(false)
                                                        navigate(`/games/${game.id}`)
                                                    }}
                                                >
                                                    <span>{game.title}</span>
                                                    <span className="text-(--color-foreground)/60">{game.price}</span>
                                                </div>
                                            ))}
                                            {filteredGames.length > 5 && !showAllResults && (
                                                <button
                                                    className="w-full text-center py-2 text-blue-500 hover:bg-(--color-foreground)/5 border-t border-(--color-foreground)/10"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setShowAllResults(true)
                                                    }}
                                                >
                                                    Show all {filteredGames.length} results
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="px-4 py-2 text-(--color-foreground)/60">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </form>

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
                                        className="w-56 bg-(--color-background)/80 text-(--color-light-ed)/80"
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

                                        <DropdownMenuItem className="cursor-pointer focus:bg-(--color-foreground)/5">
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
                            <Link to="/login">
                                <Button variant="ghost" size="icon" className="text-(--color-foreground)">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}