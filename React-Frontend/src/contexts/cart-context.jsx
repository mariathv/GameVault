"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { initialCart } from "@/dummydata-lib/data";
import { Navigate, useNavigate } from "react-router-dom";

const CartContext = createContext(undefined);

const calculateCartTotals = (items, promo = null) => {
    const subtotal = items.reduce((total, item) => {
        const game = item.game;
        if (!game) return total;

        const price = game.isDiscount ? game.price * (1 - game.discountPercentage / 100) : game.price;
        return total + price * item.quantity;
    }, 0);

    const tax = subtotal * 0.08;
    let discount = 0;

    if (promo) {
        discount = promo.discountType === 'percentage'
            ? (promo.discountValue / 100) * subtotal
            : promo.discountValue;
    }

    const total = subtotal + tax - discount;

    return {
        subtotal: +subtotal.toFixed(2),
        tax: +tax.toFixed(2),
        discount: +discount.toFixed(2),
        total: +Math.max(total, 0).toFixed(2)
    };
};


export function CartProvider({ children }) {
    const [cart, setCart] = useState(initialCart);
    const navigate = useNavigate();

    const [promoCode, setPromoCode] = useState(null);


    const applyPromo = ({ promoCode, discount, newTotal }) => {
        setCart((prevCart) => ({
            ...prevCart,
            total: +newTotal.toFixed(2),
            discount: +discount.toFixed(2)
        }));
        setPromoCode(promoCode);
    };



    useEffect(() => {
        const savedCart = localStorage.getItem("gameVaultCart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCart(parsedCart);
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("gameVaultCart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (game) => {
        console.log('adding to cart', game);
        setCart((prevCart) => {
            const existingItem = prevCart.items.find((item) => item.game.id === game.id);
            let updatedItems;

            if (existingItem) {
                updatedItems = prevCart.items.map((item) =>
                    item.game.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedItems = [...prevCart.items, { game, quantity: 1 }];
            }

            const { subtotal, tax, total } = calculateCartTotals(updatedItems);
            navigate("/cart")

            return { items: updatedItems, subtotal, tax, total };
        });
    };


    const removeFromCart = (gameId) => {
        setCart((prevCart) => {
            const updatedItems = prevCart.items.filter((item) => item.game.id !== gameId);
            const { subtotal, tax, total } = calculateCartTotals(updatedItems);

            return { items: updatedItems, subtotal, tax, total };
        });
    };


    const updateQuantity = (gameId, quantity) => {
        if (quantity < 1) {
            removeFromCart(gameId);
            return;
        }

        setCart((prevCart) => {
            const updatedItems = prevCart.items.map((item) =>
                item.game.id === gameId ? { ...item, quantity } : item
            );

            const { subtotal, tax, total } = calculateCartTotals(updatedItems);

            return { items: updatedItems, subtotal, tax, total };
        });
    };


    const clearCart = () => {
        setCart(initialCart);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, applyPromo, promoCode }}>


            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
