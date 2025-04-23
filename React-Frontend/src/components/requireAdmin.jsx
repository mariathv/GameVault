// src/components/RequireAdmin.jsx
import { Navigate } from "react-router-dom"
import { useAuth } from "@/src/contexts/auth-context"

export default function RequireAdmin({ children }) {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    if (user?.role !== "admin") {
        return <Navigate to="/" />
    }

    return children
}
