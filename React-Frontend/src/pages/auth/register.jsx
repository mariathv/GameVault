// @ts-nocheck


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
            console.log("main, registering");
            const result = await register(name, email, password, confirmPassword)

            if (result) {
                toast({
                    title: "Registration Successful",
                    description: "Account created successfully!",
                })
                navigate("/")
            } else {
                setError("Registration failed. Please try again.")
                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: "Something went wrong. Please try again.",
                })
            }


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
        <div
            className="min-h-screen bg-[#0A0E17] bg-cover bg-center bg-no-repeat bg-image-dark"
            style={{ backgroundImage: `url( https://i.ibb.co/wNhs296g/wallpaperflare-com-wallpaper.jpg)`, backgroundAttachment: 'fixed', }}
        >
            <Header searchQuery="" setSearchQuery={() => { }} />

            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Card className="gradient-border sw-full max-w-md border-(--color-light-ed)/10 bg-(--color-light-ed)/5 text-(--color-light-ed)">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription className="text-(--color-light-ed)/60">
                            Enter your information to create a GameVault account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Username</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Username"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
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
                                    className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
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
                                    className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
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
                                    className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating account..." : "Register"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-(--color-light-ed)/10" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-(--color-light-ed)/5 px-2 text-(--color-light-ed)/60">or continue with</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="border-(--color-light-ed)/10 text-(--color-light-ed) hover:bg-(--color-light-ed)/10">
                                Google
                            </Button>
                            <Button variant="outline" className="border-(--color-light-ed)/10 text-(--color-light-ed) hover:bg-(--color-light-ed)/10">
                                Discord
                            </Button>
                        </div>
                        <div className="text-center text-sm text-(--color-light-ed)/60">
                            Already have an account?{" "}
                            <Link to="/login" className="text-(--color-light-ed) hover:underline">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

