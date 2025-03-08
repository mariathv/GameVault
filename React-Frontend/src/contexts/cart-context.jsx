"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { initialCart, calculateCartTotals } from "@/dummydata-lib/data";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(initialCart);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCart(parsedCart);
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (gameId) => {
        setCart((prevCart) => {
            const existingItem = prevCart.items.find((item) => item.gameId === gameId);

            let updatedItems;
            if (existingItem) {
                updatedItems = prevCart.items.map((item) =>
                    item.gameId === gameId ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedItems = [...prevCart.items, { gameId, quantity: 1 }];
            }

            const { subtotal, tax, total } = calculateCartTotals(updatedItems);

            return {
                items: updatedItems,
                subtotal,
                tax,
                total,
            };
        });
    };

    const removeFromCart = (gameId) => {
        setCart((prevCart) => {
            const updatedItems = prevCart.items.filter((item) => item.gameId !== gameId);
            const { subtotal, tax, total } = calculateCartTotals(updatedItems);

            return {
                items: updatedItems,
                subtotal,
                tax,
                total,
            };
        });
    };

    const updateQuantity = (gameId, quantity) => {
        if (quantity < 1) {
            removeFromCart(gameId);
            return;
        }

        setCart((prevCart) => {
            const updatedItems = prevCart.items.map((item) =>
                item.gameId === gameId ? { ...item, quantity } : item
            );

            const { subtotal, tax, total } = calculateCartTotals(updatedItems);

            return {
                items: updatedItems,
                subtotal,
                tax,
                total,
            };
        });
    };

    const clearCart = () => {
        setCart(initialCart);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
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
