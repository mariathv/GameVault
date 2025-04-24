"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Clock, Mail } from "lucide-react"
import { useAuth } from "@/src/contexts/auth-context"

export default function TwoFactorAuthPage() {
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes countdown
    const [userEmail, setUserEmail] = useState("") // Will be populated from session/context
    const navigate = useNavigate()
    const inputRefs = useRef([])

    const { verify2FA } = useAuth()

    useEffect(() => {
        const userEmail = localStorage.getItem("tfa_mail")
        const userToken = localStorage.getItem("gamevault_token")

        setUserEmail(userEmail)

        // Request 2FA code on page load
        // handleSendCode()
    }, [])

    // Timer countdown effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleInputChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(0, 1)
        }

        const newCode = [...verificationCode]
        newCode[index] = value
        setVerificationCode(newCode)

        // Auto-focus next input if current input is filled
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").trim()

        if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
            const newCode = [...verificationCode]

            for (let i = 0; i < pastedData.length; i++) {
                if (i < 6) {
                    newCode[i] = pastedData[i]
                }
            }

            setVerificationCode(newCode)

            // Focus the next empty input or the last input
            const nextEmptyIndex = newCode.findIndex((c) => !c)
            if (nextEmptyIndex !== -1) {
                inputRefs.current[nextEmptyIndex]?.focus()
            } else {
                inputRefs.current[5]?.focus()
            }
        }
    }

    const handleSendCode = async () => {
        try {
            setIsLoading(true)

            const response = await fetch("/api/auth/send-2fa-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Important for cookies/session
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to send verification code")
            }

            setTimeLeft(300) // Reset timer to 5 minutes
            toast.success("Verification code sent to your email")
        } catch (err) {
            toast.error(err.message || "Failed to send verification code")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const code = verificationCode.join("");

        if (code.length !== 6) {
            setError("Please enter the 6-digit verification code from your email");
            toast.error("Please enter the 6-digit verification code");
            setIsLoading(false);
            return;
        }

        try {
            console.log("verifyinggggggg ---------------------")
            const response = await verify2FA(code);

            toast.success("Two-factor authentication successful");


            navigate("/");
        } catch (err) {
            const msg = err.message || "Verification failed. Please try again.";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };


    // Mask email for privacy
    const maskEmail = (email) => {
        if (!email) return ""
        const [username, domain] = email.split("@")
        return `${username.charAt(0)}${"*".repeat(username.length - 2)}${username.charAt(username.length - 1)}@${domain}`
    }

    return (
        <div
            className="min-h-screen bg-[#0A0E17] bg-cover bg-center bg-no-repeat bg-image-dark"
            style={{
                backgroundImage: `url(https://i.ibb.co/wNhs296g/wallpaperflare-com-wallpaper.jpg)`,
                backgroundAttachment: "fixed",
            }}
        >
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Card className="gradient-border w-full max-w-md border-(--color-light-ed)/10 bg-(--color-background)/80 text-(--color-light-ed)">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
                        <CardDescription className="text-(--color-light-ed)/60">
                            Enter the 6-digit code sent to {maskEmail(userEmail)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="verification-code">Verification Code</Label>
                                <div className="flex justify-between gap-2">
                                    {verificationCode.map((digit, index) => (
                                        <Input
                                            key={index}
                                            // ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            className="w-12 h-12 text-center text-xl bg-(--color-light-ed)/5 border-(--color-light-ed)/10 text-(--color-light-ed)"
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </div>

                            <div className="flex items-center justify-center space-x-2 text-sm text-(--color-light-ed)/60">
                                <Clock className="h-4 w-4" />
                                <span>Code expires in: {formatTime(timeLeft)}</span>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90"
                                disabled={isLoading}
                            >
                                {isLoading ? "Verifying..." : "Verify"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-(--color-light-ed)/10" />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3 w-full">
                            <Button
                                variant="outline"
                                className="w-full border-(--color-light-ed)/10 text-(--color-light-ed) hover:bg-(--color-light-ed)/10"
                                onClick={handleSendCode}
                                disabled={isLoading || timeLeft > 270} // Prevent spam clicks (30 second cooldown)
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                {timeLeft > 270 ? `Resend code (${formatTime(timeLeft - 270)})` : "Resend code"}
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full text-(--color-light-ed)/60 hover:text-(--color-light-ed) hover:bg-(--color-light-ed)/5"
                                onClick={() => navigate("/login")}
                                disabled={isLoading}
                            >
                                Cancel and return to login
                            </Button>
                        </div>

                        <div className="text-center text-sm text-(--color-light-ed)/60 mt-4">
                            Didn't receive the email? Check your spam folder.
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}