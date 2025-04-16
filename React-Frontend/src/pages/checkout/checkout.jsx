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
import { FaCreditCard } from "react-icons/fa"
import { SiVisa, SiMastercard, SiPaypal, SiAmericanexpress, SiDiscover } from "react-icons/si";
import { placeOrder } from "@/src/api/order"
import { useAuth } from "@/src/contexts/auth-context"

export default function CheckoutPage() {
    const navigate = useNavigate()

    const { user } = useAuth();
    const { cart, clearCart, promoCode } = useCart()
    const [paymentMethod, setPaymentMethod] = useState("credit-card")
    const [processedData, setProcessedData] = useState(null);
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

    const [errors, setErrors] = useState({
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
        cvv: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

    const validateForm = () => {
        let validationErrors = {};
        let formValid = true;

        // Check if required fields are filled
        if (!formState.firstName) {
            validationErrors.firstName = "First Name is required";
            formValid = false;
        }
        if (!formState.lastName) {
            validationErrors.lastName = "Last Name is required";
            formValid = false;
        }
        if (!formState.email) {
            validationErrors.email = "Email is required";
            formValid = false;
        }
        if (!formState.address) {
            validationErrors.address = "Address is required";
            formValid = false;
        }
        if (!formState.city) {
            validationErrors.city = "City is required";
            formValid = false;
        }
        if (!formState.zipCode) {
            validationErrors.zipCode = "ZIP Code is required";
            formValid = false;
        }
        if (paymentMethod === "credit-card") {
            if (!formState.cardNumber) {
                validationErrors.cardNumber = "Card Number is required";
                formValid = false;
            }
            if (!formState.cardName) {
                validationErrors.cardName = "Name on Card is required";
                formValid = false;
            }
            if (!formState.expiryDate) {
                validationErrors.expiryDate = "Expiry Date is required";
                formValid = false;
            }
            if (!formState.cvv) {
                validationErrors.cvv = "CVV is required";
                formValid = false;
            }
        }

        setErrors(validationErrors);
        return formValid;
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        console.log(user, "userid");

        const orderData = {
            userId: user._id,
            games: cart.items.map(item => ({
                gameId: item.game._id,
                quantity: item.quantity,
            })),
            paymentMethod,
        };

        try {
            const response = await placeOrder(orderData.userId, orderData.games, orderData.paymentMethod);

            console.log(response);
            setProcessedData(response);

            setIsSubmitting(false);
            setIsComplete(true);
            clearCart();
        } catch (error) {
            setIsSubmitting(false);
        }

    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-(--color-background)">
                <main className="container mx-auto px-4 py-25">
                    <div className="max-w-5xl mx-auto gap-8 flex flex-col md:flex-row items-center">

                        <div className="w-full md:w-1/2 max-w-md mx-auto text-center">
                            <div className="mx-auto w-24 h-24 rounded-full bg-(--color-light-ed)/5 flex items-center justify-center mb-6">
                                <CheckCircle className="h-12 w-12 text-green-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-(--color-light-ed) mb-4">Order Complete!</h1>
                            <p className="text-(--color-light-ed)/80 mb-8">
                                Thank you for your purchase. Your order has been processed successfully. You will receive a confirmation email shortly.
                            </p>
                            <Button className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90" onClick={() => navigate("/")}>
                                Continue Shopping
                            </Button>
                        </div>

                        {/* Right Column (Games List) */}
                        <div className="flex flex-col items-center text-center w-full">
                            <div className="space-y-4 w-full max-w-3xl mx-auto">
                                {processedData?.order?.games?.map((game, index) => (
                                    <div
                                        key={game.gameId}
                                        className="bg-(--color-light-ed)/5 p-6 rounded-lg shadow-md w-full max-w-xs mx-auto"
                                    >
                                        <h4 className="text-lg font-semibold text-(--color-light-ed)">{game.title}</h4>
                                        <p className="text-(--color-light-ed)/80 mt-2">
                                            {game.gameKeys.map((key, keyIndex) => (
                                                <span key={keyIndex} className="font-bold block mt-2">
                                                    Game Key {keyIndex + 1}: {key}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-(--color-background)">
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
                                        {/* <div className="space-y-2">
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
                                                </SelectContent>
                                            </Select>
                                        </div> */}
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
                                                    <FaCreditCard className="mr-2 h-5 w-5" />
                                                    Credit / Debit Card
                                                </div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md border-(--color-light-ed)/10 p-3 hover:bg-(--color-light-ed)/10">
                                            <RadioGroupItem value="paypal" id="paypal" />
                                            <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                                                <div className="flex items-center">
                                                    <SiPaypal className="mr-2 h-6 w-6 text-blue-600" />
                                                    PayPal
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {paymentMethod === "credit-card" && (
                                        <div className="space-y-4 mt-4 p-4 border-(--color-light-ed)/10 rounded-md">

                                            <div className="flex gap-6 p-2  text-sm ">
                                                <div className="flex flex-col items-center space-y-2 cursor-pointer hover:text-blue-600">
                                                    <SiVisa className="h-6 w-6 text-blue-500" />
                                                </div>
                                                <div className="flex flex-col items-center space-y-2 cursor-pointer hover:text-red-600">
                                                    <SiMastercard className="h-6 w-6  text-red-500" />
                                                </div>
                                                <div className="flex flex-col items-center space-y-2 cursor-pointer hover:text-blue-600">
                                                    <SiDiscover className="h-6 w-6  text-blue-600" />
                                                </div>
                                            </div>
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
                                {promoCode && (
                                    <div className="text-sm text-(--color-foreground)/50 italic">Promo Applied: {promoCode}</div>
                                )}

                                {cart.discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Promo Discount</span>
                                        <span>- ${cart.discount.toFixed(2)}</span>
                                    </div>
                                )}

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

