"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, ShieldCheck, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/src/components/Header"
import { useCart } from "@/src/contexts/cart-context"

export default function CheckoutPage() {
    const navigate = useNavigate()
    const { cart, clearCart } = useCart()
    const [paymentMethod, setPaymentMethod] = useState("credit-card")
    const [formState, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsComplete(true)
            clearCart()
        }, 1500)
    }

    if (isComplete) {
        return (
            <div className="min-h-screen bg-(--color-background)">
                <Header />
                <main className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto text-center">
                        <div className="mx-auto w-24 h-24 rounded-full bg-(--color-light-ed)/5 flex items-center justify-center mb-6">
                            <CheckCircle className="h-12 w-12 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-(--color-light-ed) mb-4">Order Complete!</h1>
                        <p className="text-(--color-light-ed)/80 mb-8">
                            Thank you for your purchase. Your order has been processed successfully. You will receive a confirmation
                            email shortly.
                        </p>
                        <Button className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90" onClick={() => navigate("/")}>
                            Continue Shopping
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-(--color-background)">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    className="mb-6 text-(--color-light-ed) hover:bg-(--color-light-ed)/10"
                    onClick={() => navigate("/cart")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
                </Button>

                <h1 className="text-3xl font-bold text-(--color-light-ed) mb-8">Checkout</h1>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            <Card className="border-(--color-light-ed)/10 bg-(--color-light-ed)/5 text-(--color-light-ed) mb-6">
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={formState.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={formState.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formState.email}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-(--color-light-ed)/10 bg-(--color-light-ed)/5 text-(--color-light-ed) mb-6">
                                <CardHeader>
                                    <CardTitle>Shipping Address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={formState.address}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={formState.city}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Select
                                                onValueChange={(value) => setFormState((prev) => ({ ...prev, state: value }))}
                                                value={formState.state}
                                            >
                                                <SelectTrigger className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="AL">Alabama</SelectItem>
                                                    <SelectItem value="AK">Alaska</SelectItem>
                                                    <SelectItem value="AZ">Arizona</SelectItem>
                                                    <SelectItem value="CA">California</SelectItem>
                                                    <SelectItem value="CO">Colorado</SelectItem>
                                                    <SelectItem value="NY">New York</SelectItem>
                                                    <SelectItem value="TX">Texas</SelectItem>
                                                    {/* Add more states as needed */}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipCode">ZIP Code</Label>
                                            <Input
                                                id="zipCode"
                                                name="zipCode"
                                                value={formState.zipCode}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-(--color-light-ed)/10 bg-(--color-light-ed)/5 text-(--color-light-ed) mb-6">
                                <CardHeader>
                                    <CardTitle>Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                                        <div className="flex items-center space-x-2 rounded-md border-(--color-light-ed)/10 p-3 hover:bg-(--color-light-ed)/10">
                                            <RadioGroupItem value="credit-card" id="credit-card" />
                                            <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                                                <div className="flex items-center">
                                                    <CreditCard className="mr-2 h-5 w-5" />
                                                    Credit / Debit Card
                                                </div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md border-(--color-light-ed)/10 p-3 hover:bg-(--color-light-ed)/10">
                                            <RadioGroupItem value="paypal" id="paypal" />
                                            <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                                                <div className="flex items-center">
                                                    <svg
                                                        className="mr-2 h-5 w-5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M19.5 8.5H18.5C18.5 5.74 16.26 3.5 13.5 3.5H7.5C4.74 3.5 2.5 5.74 2.5 8.5C2.5 11.26 4.74 13.5 7.5 13.5H10.5C13.26 13.5 15.5 15.74 15.5 18.5C15.5 21.26 13.26 23.5 10.5 23.5H4.5"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M12 3.5V8.5"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M8 5.5L12 8.5L16 5.5"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    PayPal
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {paymentMethod === "credit-card" && (
                                        <div className="space-y-4 mt-4 p-4 border-(--color-light-ed)/10 rounded-md">
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber">Card Number</Label>
                                                <Input
                                                    id="cardNumber"
                                                    name="cardNumber"
                                                    value={formState.cardNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    required
                                                    className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cardName">Name on Card</Label>
                                                <Input
                                                    id="cardName"
                                                    name="cardName"
                                                    value={formState.cardName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="expiryDate">Expiry Date</Label>
                                                    <Input
                                                        id="expiryDate"
                                                        name="expiryDate"
                                                        value={formState.expiryDate}
                                                        onChange={handleInputChange}
                                                        placeholder="MM/YY"
                                                        required
                                                        className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cvv">CVV</Label>
                                                    <Input
                                                        id="cvv"
                                                        name="cvv"
                                                        value={formState.cvv}
                                                        onChange={handleInputChange}
                                                        placeholder="123"
                                                        required
                                                        className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </form>
                    </div>

                    <div>
                        <Card className="border-(--color-light-ed)/10 bg-(--color-light-ed)/5 text-(--color-light-ed) sticky top-24">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cart.items.map(({ game, quantity }) => (
                                    <div key={game.id} className="flex justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium">{game.name}</p>
                                            <p className="text-sm text-(--color-light-ed)/60">Qty: {quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            {game.onSale ? (
                                                <span className="text-green-400 font-bold">
                                                    ${(game.price * (1 - game.discount / 100) * quantity).toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="font-bold">${(game.price * quantity).toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Separator className="bg-(--color-light-ed)/10" />
                                <div className="flex justify-between">
                                    <span className="text-(--color-light-ed)/80">Subtotal</span>
                                    <span>${cart.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-(--color-light-ed)/80">Tax</span>
                                    <span>${cart.tax.toFixed(2)}</span>
                                </div>
                                <Separator className="bg-(--color-light-ed)/10" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${cart.total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button
                                    className="w-full bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Complete Purchase"}
                                </Button>
                                <div className="flex items-center justify-center text-sm text-(--color-light-ed)/60">
                                    <ShieldCheck className="h-4 w-4 mr-1" />
                                    Secure checkout
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

