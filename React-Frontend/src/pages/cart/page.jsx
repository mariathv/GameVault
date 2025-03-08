"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Trash2, ShoppingCart, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Header from "@/src/components/Header"
import { games, initialCart, calculateCartTotals } from "@/dummydata-lib/data"
import { Link } from "react-router-dom"

export default function CartPage() {
    const [searchParams] = useSearchParams(); // Destructure the array


    const navigate = useNavigate()

    const addGameId = searchParams.get("add")

    const [cart, setCart] = useState(initialCart);


    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem("gameVaultCart")
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
    }, [])

    // Add game to cart if specified in URL
    useEffect(() => {
        if (addGameId) {
            const gameId = Number.parseInt(addGameId)
            const game = games.find((g) => g.id === gameId)

            if (game) {
                addToCart(gameId)
                navigate("/cart", { replace: true }) // for replacing URL

            }
        }
    }, [addGameId, navigate])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("gameVaultCart", JSON.stringify(cart))
    }, [cart])

    const addToCart = (gameId) => {
        setCart((prevCart) => {
            const existingItem = prevCart.items.find((item) => item.gameId === gameId)

            let updatedItems

            if (existingItem) {
                // Increment quantity if item already exists
                updatedItems = prevCart.items.map((item) =>
                    item.gameId === gameId ? { ...item, quantity: item.quantity + 1 } : item,
                )
            } else {
                // Add new item
                updatedItems = [...prevCart.items, { gameId, quantity: 1 }]
            }

            const { subtotal, tax, total } = calculateCartTotals(updatedItems)

            return {
                items: updatedItems,
                subtotal,
                tax,
                total,
            }
        })
    }

    const removeFromCart = (gameId) => {
        setCart((prevCart) => {
            const updatedItems = prevCart.items.filter((item) => item.gameId !== gameId)
            const { subtotal, tax, total } = calculateCartTotals(updatedItems)

            return {
                items: updatedItems,
                subtotal,
                tax,
                total,
            }
        })
    }

    const updateQuantity = (gameId, quantity) => {
        if (quantity < 1) return

        setCart((prevCart) => {
            const updatedItems = prevCart.items.map((item) => (item.gameId === gameId ? { ...item, quantity } : item))

            const { subtotal, tax, total } = calculateCartTotals(updatedItems)

            return {
                items: updatedItems,
                subtotal,
                tax,
                total,
            }
        })
    }

    const clearCart = () => {
        setCart(initialCart)
    }

    const proceedToCheckout = () => {
        navigate("/checkout")

    }

    return (
        <div className="min-h-screen bg-[#14202C] text-[#EDEDED]">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

                {cart.items.length === 0 ? (
                    <div className="bg-[#EDEDED]/5 rounded-lg p-8 text-center border border-[#EDEDED]/10">
                        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-[#EDEDED]/40" />
                        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-[#EDEDED]/60 mb-6">Looks like you haven't added any games to your cart yet.</p>
                        <Link href="/search">
                            <Button className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90">Browse Games</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart items */}
                        <div className="lg:col-span-2">
                            <div className="bg-[#EDEDED]/5 rounded-lg border border-[#EDEDED]/10 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">
                                            Cart Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})
                                        </h2>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[#EDEDED]/60 hover:text-[#EDEDED] hover:bg-transparent"
                                            onClick={clearCart}
                                        >
                                            Clear Cart
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {cart.items.map((item) => {
                                            const game = games.find((g) => g.id === item.gameId)
                                            if (!game) return null

                                            const actualPrice = game.onSale ? game.price * (1 - game.discount / 100) : game.price

                                            return (
                                                <div key={item.gameId} className="flex items-center gap-4 py-4">
                                                    <Link href={`/games/${game.id}`} className="shrink-0">
                                                        <div className="w-24 h-16 overflow-hidden rounded-md">
                                                            <img
                                                                src={game.image || "/placeholder.svg"}
                                                                alt={game.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </Link>

                                                    <div className="flex-1 min-w-0">
                                                        <Link href={`/games/${game.id}`}>
                                                            <h3 className="font-semibold truncate hover:text-[#EDEDED]/80 transition-colors">
                                                                {game.title}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-sm text-[#EDEDED]/60">{game.genre}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 border-[#EDEDED]/20 hover:bg-[#EDEDED]/5"
                                                            onClick={() => updateQuantity(item.gameId, item.quantity - 1)}
                                                        >
                                                            -
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.gameId, Number.parseInt(e.target.value) || 1)}
                                                            className="w-14 h-8 text-center bg-[#EDEDED]/5 border-[#EDEDED]/10"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 border-[#EDEDED]/20 hover:bg-[#EDEDED]/5"
                                                            onClick={() => updateQuantity(item.gameId, item.quantity + 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>

                                                    <div className="text-right min-w-[80px]">
                                                        {game.onSale && (
                                                            <div className="text-xs line-through text-[#EDEDED]/60">
                                                                ${(game.price * item.quantity).toFixed(2)}
                                                            </div>
                                                        )}
                                                        <div className="font-semibold">${(actualPrice * item.quantity).toFixed(2)}</div>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-[#EDEDED]/60 hover:text-red-500 hover:bg-transparent"
                                                        onClick={() => removeFromCart(item.gameId)}
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                        <span className="sr-only">Remove</span>
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#EDEDED]/5 rounded-lg border border-[#EDEDED]/10 p-6 sticky top-24">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-[#EDEDED]/60">Subtotal</span>
                                        <span>${cart.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#EDEDED]/60">Tax (8%)</span>
                                        <span>${cart.tax.toFixed(2)}</span>
                                    </div>
                                    <Separator className="bg-[#EDEDED]/10 my-2" />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>${cart.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90 mb-3"
                                    onClick={proceedToCheckout}
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Proceed to Checkout
                                </Button>

                                <Link href="/search">
                                    <Button variant="outline" className="w-full border-[#EDEDED]/20 hover:bg-[#EDEDED]/5">
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

