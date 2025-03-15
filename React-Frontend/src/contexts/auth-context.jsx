

import { createContext, useContext, useState, useEffect } from "react"
import { apiRequest } from "../hooks/api/api-gamevault"

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

    const login = async (email, password) => {
        const user = {
            email,
            password
        };
        console.log("login start");

        const response = await apiRequest("auth/login", user);
        console.log(response);

        if (response.status === "success" && response.data?.user) {
            console.log('success context');

            localStorage.setItem("gamevault_user", JSON.stringify(response.data.user));
            localStorage.setItem("gamevault_token", response.token);

            setUser(response.data.user);
            setIsAuthenticated(true);

            return Promise.resolve(response.data.user);
        } else {
            console.log('unsuccess context');
            return Promise.resolve(null);
        }
    };


    const register = async (username, email, password, passwordConfirm) => {

        const user = {
            id: "user123",
            username: username,
            email,
            password,
            passwordConfirm
        }
        const response = await apiRequest("auth/register", user);

        if (response.status === "success" && response.data?.user) {

            setUser(response.data?.user)
            setIsAuthenticated(true)
            localStorage.setItem("gamevault_user", JSON.stringify(response.data?.user))
            return Promise.resolve(response.data?.user)
        } else {
            return Promise.resolve(null);

        }


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

