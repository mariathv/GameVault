import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/src/components/Header";
import { useCart } from "@/src/contexts/cart-context";
import { Input } from "@/components/ui/input"

export default function CartPage() {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const [promoCode, setPromoCode] = useState("");

    const handleQuantityChange = (gameId, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);
        if (!isNaN(quantity) && quantity >= 1) {
            updateQuantity(gameId, quantity);
        }
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div className="min-h-screen bg-[#14202C]">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[#EDEDED] mb-8">Your Shopping Cart</h1>
                {cart.items.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 rounded-full bg-[#EDEDED]/5 flex items-center justify-center mb-6">
                            <ShoppingCart className="h-12 w-12 text-[#EDEDED]/40" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#EDEDED] mb-2">Your cart is empty</h2>
                        <p className="text-[#EDEDED]/60 mb-6">Looks like you haven't added any games to your cart yet.</p>
                        <Button className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90" onClick={() => navigate("/")}>Browse Games</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map(({ game, quantity }) => (
                                <Card key={game.id} className="p-0 overflow-hidden border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED]">

                                    <div className="flex flex-col sm:flex-row">
                                        <div className="sm:w-1/4 cursor-pointer" onClick={() => navigate(`/games/${game.id}`)}>
                                            <div className="aspect-auto sm:aspect-square w-full overflow-hidden">
                                                <img src={game.cover_url || "/placeholder.svg"} alt={game.title} className="w-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="flex-1 p-4">
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-1 cursor-pointer" onClick={() => navigate(`/games/${game.id}`)}>{game.title}</h3>
                                                    <p className="text-sm text-[#EDEDED]/60 mb-2">{game.genre}</p>
                                                </div>
                                                <div className="mt-2 sm:mt-0 text-right">
                                                    {game.onSale ? (
                                                        <div>
                                                            <span className="line-through text-[#EDEDED]/60 text-sm mr-2">${game.price.toFixed(2)}</span>
                                                            <span className="text-green-400 font-bold">${(game.price * (1 - game.discount / 100)).toFixed(2)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-bold">${game.price?.toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center">
                                                    <span className="text-sm mr-2">Qty:</span>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={quantity}
                                                        onChange={(e) => handleQuantityChange(game.id, e.target.value)}
                                                        className="w-16 bg-[#EDEDED]/5 border-[#EDEDED]/10 text-[#EDEDED]"
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFromCart(game.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            <div className="mt-4 flex justify-between">
                                <Button variant="outline" onClick={clearCart} className="border-[#EDEDED]/10 text-[#EDEDED] hover:bg-[#EDEDED]/10">Clear Cart</Button>
                                <Button variant="outline" onClick={() => navigate("/")} className="border-[#EDEDED]/10 text-[#EDEDED] hover:bg-[#EDEDED]/10">Continue Shopping</Button>
                            </div>
                        </div>
                        <div>
                            <Card className="border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED] sticky top-24">
                                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between"><span className="text-[#EDEDED]/80">Subtotal</span><span>${cart.subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span className="text-[#EDEDED]/80">Tax</span><span>${cart.tax.toFixed(2)}</span></div>
                                    <div className="flex gap-2">
                                        <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="bg-[#EDEDED]/5 border-[#EDEDED]/10 text-[#EDEDED]" />
                                        <Button variant="outline" className="border-[#EDEDED]/10 text-[#EDEDED] hover:bg-[#EDEDED]/10">Apply</Button>
                                    </div>
                                    <Separator className="bg-[#EDEDED]/10" />
                                    <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${cart.total.toFixed(2)}</span></div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90" onClick={handleCheckout}>Checkout <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
