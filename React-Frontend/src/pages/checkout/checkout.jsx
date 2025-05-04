"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  Wallet,
  CreditCardIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/src/components/Header";
import { useCart } from "@/src/contexts/cart-context";
import { FaCreditCard } from "react-icons/fa";
import { SiVisa, SiMastercard, SiDiscover } from "react-icons/si";
import { placeOrder } from "@/src/api/order";
import { updateUserWallet } from "@/src/api/users";
import { createCustomer, saveCard, processPayment } from "@/src/api/payment";
import { useAuth } from "@/src/contexts/auth-context";
import { useCurrency } from "@/src/contexts/currency-context";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { currency, convertPrice } = useCurrency();
  const { user, updateUser } = useAuth();
  const { cart, clearCart, promoCode } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [processedData, setProcessedData] = useState(null);
  const [walletError, setWalletError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardNonce, setCardNonce] = useState(null);
  const [paymentFormErrors, setPaymentFormErrors] = useState(null);
  const [squareScript, setSquareScript] = useState(null);
  const cardRef = useRef(null); // Ref to store the card instance
  const [squarePaymentLoaded, setSquarePaymentLoaded] = useState(false); // Track if the square payment form is loaded
  const [isCardInitialized, setIsCardInitialized] = useState(false); // Prevent multiple initializations

  const [formState, setFormState] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSquareSDKReady, setIsSquareSDKReady] = useState(false);

  useEffect(() => {
    const loadSquareSDK = () => {
      return new Promise((resolve, reject) => {
        if (window.Square) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://js.squareup.com/v2/paymentform";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Square SDK"));

        document.body.appendChild(script);
      });
    };

    loadSquareSDK()
      .then(() => {
        console.log("Square SDK loaded successfully");
        setIsSquareSDKReady(true); // mark SDK ready
      })
      .catch((error) => {
        console.error(error.message);
      });

    return () => {
      if (cardRef.current) {
        cardRef.current.destroy();
        cardRef.current = null;
      }
    };
  }, []);

  // Handle card init/destroy on paymentMethod change
  useEffect(() => {
    // Only try to init card if SDK is ready
    if (paymentMethod === "credit-card" && isSquareSDKReady) {
      initializeCard();
    } else {
      if (cardRef.current) {
        cardRef.current.destroy();
        cardRef.current = null;
        console.log("Square card destroyed on payment method change");
      }
    }
  }, [paymentMethod, isSquareSDKReady]);

  async function initializeCard() {
    if (!window.Square) {
      console.error("Square SDK is still not available");
      return;
    }

    try {
      const payments = window.Square.payments(
        import.meta.env.VITE_API_SQUARE_APPLICATION_ID,
        import.meta.env.VITE_API_SQUARE_LOCATION_ID
      );

      const card = await payments.card();
      await card.attach("#card-container");
      cardRef.current = card;
      setSquarePaymentLoaded(true);
      console.log("Square card initialized");
    } catch (error) {
      console.error("Error initializing Square card:", error);
    }
  }

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

    setErrors(validationErrors);
    return formValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setWalletError("");

    try {
      // Check if using wallet payment and has insufficient funds
      if (paymentMethod === "wallet") {
        if (user.wallet < cart.total) {
          setWalletError(
            `Insufficient funds. Your wallet balance (${convertPrice(
              user.wallet
            )}) is less than the total (${convertPrice(cart.total)})`
          );
          setIsSubmitting(false);
          return;
        }

        const orderData = {
          userId: user._id,
          games: cart.items.map((item) => ({
            gameId: item.game._id,
            quantity: item.quantity,
          })),
          paymentMethod: "wallet",
        };

        // Process wallet payment
        const response = await placeOrder(
          orderData.userId,
          orderData.games,
          orderData.paymentMethod
        );

        // Update wallet in the database
        const walletResponse = await updateUserWallet(
          user._id,
          cart.total,
          "deduct"
        );

        updateUser({
          ...user,
          wallet: walletResponse.data.wallet,
        });

        setProcessedData(response);
        setIsComplete(true);
        clearCart();
      } else if (paymentMethod === "credit-card") {
        setIsProcessingPayment(true);

        if (!cardRef.current) {
          console.error("Card is not initialized or attached yet.");
          setPaymentFormErrors("Payment form is not ready. Please try again.");
          setIsProcessingPayment(false);
          return;
        }

        const result = await cardRef.current.tokenize();

        if (result.status === "OK") {
          // Create or get customer
          let customerId;
          try {
            const customerResponse = await createCustomer({
              firstName: formState.firstName,
              lastName: formState.lastName,
              email: formState.email,
              addressLine1: formState.address,
              city: formState.city,
              state: formState.state,
              postalCode: formState.zipCode,
              country: "US",
              referenceId: user._id,
            });
            customerId = customerResponse.data.customer.id;
          } catch (err) {
            console.error("Error creating customer:", err);
            setPaymentFormErrors("Failed to process customer information");
            setIsSubmitting(false);
            setIsProcessingPayment(false);
            return;
          }

          // Process payment
          try {
            const paymentData = {
              sourceId: result.token,
              customerId,
              amount: cart.total,
              currency: currency.code || "USD",
              games: cart.items.map((item) => ({
                gameId: item.game._id,
                quantity: item.quantity,
              })),
              userId: user._id,
            };

            const paymentResponse = await processPayment(paymentData);

            console.log("payment response,", paymentResponse);

            setProcessedData({
              order: {
                games: paymentResponse.data.order.games || [],
              },
            });

            setIsComplete(true);
            clearCart();
          } catch (err) {
            console.error("Payment processing error:", err);
            setPaymentFormErrors(
              "Failed to process payment. Please try again."
            );
          }
        } else {
          setPaymentFormErrors(
            result.errors.map((error) => error.message).join(", ")
          );
        }

        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setWalletError("An error occurred during checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    console.log("processed", processedData);
    return (
      <div className="min-h-screen bg-(--color-background)">
        <main className="container mx-auto px-4 py-25">
          <div className="max-w-5xl mx-auto gap-8 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 max-w-md mx-auto text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-(--color-light-ed)/5 flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-(--color-light-ed) mb-4">
                Order Complete!
              </h1>
              <p className="text-(--color-light-ed)/80 mb-8">
                Thank you for your purchase. Your order has been processed
                successfully. You will receive a confirmation email shortly.
              </p>
              {paymentMethod === "wallet" && (
                <Alert className="mb-6 bg-green-900/20 border-green-900/50 text-green-400">
                  <AlertDescription>
                    Your wallet has been updated. New balance:{" "}
                    {convertPrice(user.wallet)}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90"
                onClick={() => navigate("/")}
              >
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
                    <h4 className="text-lg font-semibold text-(--color-light-ed)">
                      {game.title}
                    </h4>
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

        <h1 className="text-3xl font-bold text-(--color-light-ed) mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="border-(--color-light-ed)/10 bg-(--color-light-ed)/5 text-(--color-light-ed) mb-6">
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
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
                      {errors.firstName && (
                        <p className="text-red-400 text-sm">
                          {errors.firstName}
                        </p>
                      )}
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
                      {errors.lastName && (
                        <p className="text-red-400 text-sm">
                          {errors.lastName}
                        </p>
                      )}
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
                    {errors.email && (
                      <p className="text-red-400 text-sm">{errors.email}</p>
                    )}
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
                    {errors.address && (
                      <p className="text-red-400 text-sm">{errors.address}</p>
                    )}
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
                      {errors.city && (
                        <p className="text-red-400 text-sm">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formState.state}
                        onChange={handleInputChange}
                        className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                      />
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
                      {errors.zipCode && (
                        <p className="text-red-400 text-sm">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-(--color-light-ed)/10 bg-(--color-light-ed)/5 text-(--color-light-ed) mb-6">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-md border-(--color-light-ed)/10 p-3 hover:bg-(--color-light-ed)/10">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label
                        htmlFor="credit-card"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <FaCreditCard className="mr-2 h-5 w-5" />
                          Credit / Debit Card
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border-(--color-light-ed)/10 p-3 hover:bg-(--color-light-ed)/10">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <Wallet className="mr-2 h-5 w-5 text-green-500" />
                          Game Vault Wallet
                          <span className="ml-2 text-sm text-(--color-light-ed)/70">
                            (Balance: {convertPrice(user.wallet)})
                          </span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {walletError && (
                    <Alert
                      variant="destructive"
                      className="mt-4 bg-red-900/20 border-red-900/50 text-red-400"
                    >
                      <AlertDescription>{walletError}</AlertDescription>
                    </Alert>
                  )}

                  {paymentMethod === "wallet" && (
                    <div className="mt-4 p-4 border border-(--color-light-ed)/10 rounded-md">
                      <div className="flex justify-between items-center">
                        <span>Current Balance:</span>
                        <span className="font-bold">
                          {convertPrice(user.wallet)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span>Amount to be deducted:</span>
                        <span className="font-bold text-red-400">
                          -{convertPrice(cart.total)}
                        </span>
                      </div>
                      <Separator className="my-2 bg-(--color-light-ed)/10" />
                      <div className="flex justify-between items-center">
                        <span>Remaining balance after purchase:</span>
                        <span className="font-bold">
                          {convertPrice(Math.max(0, user.wallet - cart.total))}
                        </span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4 mt-4 p-4 border border-(--color-light-ed)/10 rounded-md">
                      <div className="flex gap-6 p-2 text-sm">
                        <div className="flex flex-col items-center space-y-2">
                          <SiVisa className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <SiMastercard className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <SiDiscover className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>

                      <div className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed) p-4 rounded-md">
                        <div id="card-container"></div>
                        {paymentFormErrors && (
                          <p className="text-red-400 text-sm mt-2">
                            {paymentFormErrors}
                          </p>
                        )}
                        {!squarePaymentLoaded && (
                          <p className="text-amber-400 text-sm mt-2">
                            Loading payment form...
                          </p>
                        )}
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
                      <p className="text-sm text-(--color-light-ed)/60">
                        Qty: {quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      {game.onSale ? (
                        <span className="text-green-400 font-bold">
                          {convertPrice(
                            game.price * (1 - game.discount / 100) * quantity
                          )}
                        </span>
                      ) : (
                        <span className="font-bold">
                          {convertPrice(game.price * quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <Separator className="bg-(--color-light-ed)/10" />
                <div className="flex justify-between">
                  <span className="text-(--color-light-ed)/80">Subtotal</span>
                  <span>{convertPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--color-light-ed)/80">Tax</span>
                  <span>{convertPrice(cart.tax)}</span>
                </div>
                {promoCode && (
                  <div className="text-sm text-(--color-foreground)/50 italic">
                    Promo Applied: {promoCode}
                  </div>
                )}

                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Promo Discount</span>
                    <span>- {convertPrice(cart.discount)}</span>
                  </div>
                )}

                <Separator className="bg-(--color-light-ed)/10" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{convertPrice(cart.total)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  className="w-full bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    isProcessingPayment ||
                    (paymentMethod === "credit-card" && !squarePaymentLoaded)
                  }
                >
                  {isSubmitting || isProcessingPayment
                    ? "Processing..."
                    : "Complete Purchase"}
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
  );
}
