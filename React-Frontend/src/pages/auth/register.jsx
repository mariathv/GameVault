"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/src/contexts/auth-context"
import Header from "@/src/components/Header"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const { register } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Passwords do not match. Please try again.",
            })
            setIsLoading(false)
            return
        }

        try {
            await register(name, email, password)
            navigate("/") // Redirect to home page after successful registration
        } catch (err) {
            setError("Registration failed. Please try again.")
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Registration failed. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#14202C]">
            <Header searchQuery="" setSearchQuery={() => { }} />

            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Card className="gradient-border sw-full max-w-md border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED]">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription className="text-[#EDEDED]/60">
                            Enter your information to create a GameVault account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-[#EDEDED]/5 border-[#EDEDED]/10 text-[#EDEDED]"
                                />
                            </div>
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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-[#EDEDED]/5 border-[#EDEDED]/10 text-[#EDEDED]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-[#EDEDED]/5 border-[#EDEDED]/10 text-[#EDEDED]"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating account..." : "Register"}
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
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#EDEDED] hover:underline">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

