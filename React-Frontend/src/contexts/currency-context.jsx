
import { createContext, useContext, useState, useEffect } from "react"

const CurrencyContext = createContext()

const conversionRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 151.23,
    PKR: 277.90,
}

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem("currency") || "USD"
    })
    const availableCurrencies = ["USD", "EUR", "GBP", "JPY", "PKR"]



    useEffect(() => {
        console.log("changed currency", currency)
        localStorage.setItem("currency", currency)
    }, [currency])

    const convertPrice = (usdPrice, fractionDigits) => {
        const rate = conversionRates[currency] || 1
        const converted = usdPrice * rate

        const decimals = fractionDigits !== undefined
            ? fractionDigits
            : currency === "PKR"
                ? 0
                : 2

        const formatted = new Intl.NumberFormat("en", {
            style: "currency",
            currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(converted)

        if (currency === "PKR") {
            return formatted.replace("₨", "PKR ")
        }

        return formatted
    }



    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, availableCurrencies }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export const useCurrency = () => useContext(CurrencyContext)
