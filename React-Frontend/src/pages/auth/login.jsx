// @ts-nocheck


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
            const resp = await login(email, password)

            if (resp) {
                toast({
                    title: "Login Successful",
                    description: "Account login successfully!",
                })
                if (resp.role === "admin") {
                    navigate("/admin")
                } else {
                    navigate("/")
                }
            } else {
                setError("Login failed. Please try again.")
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Something went wrong. Please try again.",
                })
            }
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
        /*
        https://i.ibb.co/wNhs296g/wallpaperflare-com-wallpaper.jpg
https://i.ibb.co/kgJQ2qg7/wallpaperflare-com-wallpaper-1.jpg
        */
        <div
            className="min-h-screen bg-[#0A0E17] bg-cover bg-center bg-no-repeat bg-image-dark"
            style={{ backgroundImage: `url( https://i.ibb.co/wNhs296g/wallpaperflare-com-wallpaper.jpg)`, backgroundAttachment: 'fixed', }}
        >

            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Card className="gradient-border w-full max-w-md border-(--color-light-ed)/10 bg-(--color-background)/80 text-(--color-light-ed)">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                        <CardDescription className="text-(--color-light-ed)/60">
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
                                    className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-(--color-light-ed)/60 hover:text-(--color-light-ed) transition-colors"
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
                                    className="bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
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
                                className="w-full bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90"
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging in..." : "Login"}
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
                            Don't have an account?{" "}
                            <Link to="/register" className="text-(--color-light-ed) hover:underline">
                                Register
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

