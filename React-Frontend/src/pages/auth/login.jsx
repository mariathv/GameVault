"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/src/contexts/auth-context"
import Header from "@/src/components/Header"
import { useToast } from "@/components/ui/use-toast"
import "@/src/styles/gv-global.css"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const { login } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await login(email, password)
            navigate("/") // Redirect to home page after successful login
        } catch (err) {
            setError("Invalid email or password. Please try again.")
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid email or password. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#14202C]">
            <Header searchQuery="" setSearchQuery={() => { }} />

            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Card className="gradient-border w-full max-w-md border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED]">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                        <CardDescription className="text-[#EDEDED]/60">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="gamer@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-[#EDEDED]/5 border-[#EDEDED]/10 text-[#EDEDED]"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-[#EDEDED]/60 hover:text-[#EDEDED] transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-[#EDEDED]/5 border-[#EDEDED]/10 text-[#EDEDED]"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <Label htmlFor="remember" className="text-sm font-normal">
                                    Remember me
                                </Label>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90"
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[#EDEDED]/10" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-[#EDEDED]/5 px-2 text-[#EDEDED]/60">or continue with</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="border-[#EDEDED]/10 text-[#EDEDED] hover:bg-[#EDEDED]/10">
                                Google
                            </Button>
                            <Button variant="outline" className="border-[#EDEDED]/10 text-[#EDEDED] hover:bg-[#EDEDED]/10">
                                Discord
                            </Button>
                        </div>
                        <div className="text-center text-sm text-[#EDEDED]/60">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-[#EDEDED] hover:underline">
                                Register
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

