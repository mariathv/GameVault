"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    login: () => { },
    register: () => { },
    logout: () => { },
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Check if user is already logged in on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("gamevault_user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        }
    }, [])

    const login = (email, password) => {
        // mock implementation
        const mockUser = {
            id: "user123",
            name: "Game Player",
            email,
            avatar: "/src/assets/imgs/avatar.png",
        }

        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem("gamevault_user", JSON.stringify(mockUser))
        return Promise.resolve(mockUser)
    }

    const register = (name, email, password) => {
        const mockUser = {
            id: "user123",
            name,
            email,
            avatar: "/src/assets/imgs/avatar.png",
        }

        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem("gamevault_user", JSON.stringify(mockUser))
        return Promise.resolve(mockUser)
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem("gamevault_user")
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

