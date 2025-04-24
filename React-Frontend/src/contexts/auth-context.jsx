

import { createContext, useContext, useState, useEffect } from "react"
import { apiRequest } from "../hooks/api/api-gamevault"
import { useNavigate, useLocation } from "react-router-dom"
const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    login: () => { },
    register: () => { },
    logout: () => { },
    updateUser: () => {}
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();
    const location = useLocation(); 

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem("gamevault_token");
            
            if (!token) {
                setLoading(false);
                return;
            }
    
            try {
                const response = await apiRequest("auth/token-verify", {});
                
                // Check if this is a 2FA token
                if (response.require2FA) {
                    // Only redirect to 2FA page if not already there
                    if (location.pathname !== "/two-factor-auth") {
                        navigate("/two-factor-auth");
                    }
                    setLoading(false);
                    return;
                }
    
                if (response.status === "success" && response.data?.user) {
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                    localStorage.setItem("gamevault_user", JSON.stringify(response.data.user));
                    
                    const authPages = ['/login', '/register', '/two-factor-auth'];
                    
                    // Only redirect if on an auth page
                    if (authPages.includes(location.pathname)) {
                        if (response.data.user.role === "admin") {
                            navigate("/admin");
                        } else {
                            navigate("/");
                        }
                    }
                    // Otherwise, stay on the current page
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    localStorage.removeItem("gamevault_user");
                    localStorage.removeItem("gamevault_token");
                }
            } catch (err) {
                console.error("Auto-login failed:", err);
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem("gamevault_user");
                localStorage.removeItem("gamevault_token");
            } finally {
                setLoading(false);
            }
        };
    
        initializeAuth();
    }, [location.pathname, navigate]);


    const login = async (email, password) => {
        const user = {
            email,
            password
        };
        console.log("login start");

        const response = await apiRequest("auth/login", user);
        console.log(response);

        if (response.require2FA) {
            console.log("requireeeee");
            localStorage.setItem("gamevault_token", response.tempToken);
            localStorage.setItem("tfa_mail", user.email)
            navigate("/two-factor-auth")
            return Promise.resolve({ require2FA: true });
        }

        if (response.status === "success" && response.data?.user) {
            console.log('success context');

            localStorage.setItem("gamevault_user", JSON.stringify(response.data.user));
            localStorage.setItem("gamevault_token", response.token);

            setUser(response.data.user);
            setIsAuthenticated(true);

            return Promise.resolve(response.data.user);
        } else {
            return Promise.reject(new Error(response.message || "Registration failed"));
        }
    };


    const register = async (username, email, password, passwordConfirm) => {
        const user = {
            id: "user123",
            username: username,
            email,
            password,
            passwordConfirm
        };

        const response = await apiRequest("auth/register", user);

        if (response.status === "success" || response.status === "pending") {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.message || "Registration failed"));
        }
    };

    const verify2FA = async (code) => {
        const response = await apiRequest("auth/verify-2fa", { code });

        if (response.status === "success" && response.data?.user) {
            console.log('success context');

            localStorage.setItem("gamevault_user", JSON.stringify(response.data.user));
            localStorage.setItem("gamevault_token", response.token);

            setUser(response.data.user);
            setIsAuthenticated(true);

            return Promise.resolve(response.data.user);
        }
        return response;
    }

    const updateUser = (userData) => {
        setUser((prevUser) => {
          const updatedUser = { ...prevUser, ...userData }
    
          localStorage.setItem("gamevault_user", JSON.stringify(updatedUser))
    
          return updatedUser
        })
      }




    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("gamevault_user");
        localStorage.removeItem("gamevault_token");

        window.location.reload();
    }


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, verify2FA, updateUser }}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

