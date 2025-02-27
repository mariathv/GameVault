"use client"

import { useState } from "react"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission logic here
        console.log(formData)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 auth-bg ">
            <div className="w-full max-w-md">
                <div className="bg-[#EDEDED] bg-blend-overlay rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex  border-[#030404]/10">
                        <button
                            className={`flex-1 py-4 px-6 text-center  font-medium ${isLogin ? "bg-[#14202C] text-white" : "text-[#030404] hover:bg-[#14202C]/5"
                                }`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 text-center font-medium ${!isLogin ? "bg-[#14202C] text-white" : "text-[#030404] hover:bg-[#14202C]/5"
                                }`}
                            onClick={() => setIsLogin(false)}
                        >
                            Register
                        </button>
                    </div>

                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#030404] mb-6">{isLogin ? "Welcome back" : "Create an account"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[#030404] mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-[#030404]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#14202C]"
                                        placeholder="John Doe"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#030404] mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#030404]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#14202C]"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#030404] mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#030404]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#14202C]"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#030404] mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-[#030404]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#14202C]"
                                        placeholder="••••••••"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-[#14202C] focus:ring-[#14202C] border-[#030404]/20 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-[#030404]">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-[#14202C] hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-[#14202C] text-white py-2 px-4 rounded-md hover:bg-[#14202C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14202C] transition-colors"
                            >
                                {isLogin ? "Sign In" : "Create Account"}
                            </button>
                        </form>
                        {/*
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-[#030404]/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-[#EDEDED] text-[#030404]/60">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center py-2 px-4 border border-[#030404]/20 rounded-md shadow-sm bg-white text-sm font-medium text-[#030404] hover:bg-gray-50"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center py-2 px-4 border border-[#030404]/20 rounded-md shadow-sm bg-white text-sm font-medium text-[#030404] hover:bg-gray-50"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                        Twitter
                                    </button>
                                </div>
                            </div>

                        */}
                        <p className="mt-6 text-center text-sm text-[#030404]/60">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-medium text-[#14202C] hover:underline"
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

