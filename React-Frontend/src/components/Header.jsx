"use client"

import { useState } from "react"
import { Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../contexts/cart-context"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "./theme-toggle"

export default function Header({ searchQuery = "", setSearchQuery }) {
    const { cart } = useCart()
    const [query, setQuery] = useState(searchQuery)
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

    const isLogin = false

    return (
        <header className="sticky top-0 z-50 bg-(--color-background)/50 backdrop-blur-sm   border-b border-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-(--color-foreground)">
                        <div className="flex">
                            <img src="/src/assets/imgs/logo/1.png" className="w-10"></img>
                            GameVault
                        </div>
                    </Link>

                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
                        <div className="relative w-full max-w-lg">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-foreground)/60" />
                            <Input
                                type="search"
                                placeholder="Search games..."
                                className="!pl-10 w-full bg-foreground/5 border-border pl-10 text-(--color-foreground)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </form>

                    <div className="flex items-center space-x-4">
                        <Link to="/search">
                            <Button variant="ghost" size="icon" className="md:hidden text-(--color-foreground)">
                                <Search className="h-5 w-5" />
                            </Button>
                        </Link>

                        <ThemeToggle />

                        <Link to="/cart">
                            <Button variant="ghost" size="icon" className="relative !text-(--color-foreground)">
                                <ShoppingCart className="h-5 w-5" />
                                {cartItemCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-(--color-light-ed) text-(--color-alt-foreground)">
                                        {cartItemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                        {isLogin ? (
                            <Link to="/profile">
                                <Button variant="ghost" size="icon" className="text-(--color-foreground)">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
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

