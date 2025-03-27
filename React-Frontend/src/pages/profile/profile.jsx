"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    ShoppingCart,
    Heart,
    Package,
    Settings,
    LogOut,
    Edit,
    Save,
    CreditCard,
    Bell,
    ChevronRight,
} from "lucide-react"

import { useAuth } from "@/src/contexts/auth-context"

export default function Profile() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [userProfile, setUserProfile] = useState({
        name: "",
        email: "",
        bio: "",
        avatar: "",
    })

    useEffect(() => {
        // Check if user is logged in
        if (!user) {
            navigate("/auth/login")
            return
        }

        // Set initial user profile data
        setUserProfile({
            name: user.displayName || "Game Enthusiast",
            email: user.email || "",
            bio: user.bio || "No bio provided",
            avatar: user.photoURL || "",
        })
    }, [user, navigate])

    const handleProfileUpdate = () => {
        // This would be replaced with your actual API call to update the profile
        setIsEditing(false)
        // Show success message or handle errors
    }

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    if (!user) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4 bg-[#0f1623]">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg?height=96&width=96"} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                        <Button variant="ghost" size="sm" className="sm:ml-auto" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                            {isEditing ? "Save" : "Edit Profile"}
                        </Button>
                    </div>
                    <p className="text-muted-foreground mb-2">{userProfile.email}</p>

                    {isEditing ? (
                        <div className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={userProfile.name}
                                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                                    className="max-w-md"
                                />
                            </div>
                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Input
                                    id="bio"
                                    value={userProfile.bio}
                                    onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                                    className="max-w-md"
                                />
                            </div>
                            <Button onClick={handleProfileUpdate}>Save Changes</Button>
                        </div>
                    ) : (
                        <p className="max-w-md">{userProfile.bio}</p>
                    )}
                </div>
            </div>

            <Separator className="my-6" />

            {/* Quick Links Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Button
                        variant="outline"
                        className="h-auto py-6 flex justify-between items-center"
                        onClick={() => navigate("/wishlist")}
                    >
                        <div className="flex items-center">
                            <Heart className="h-5 w-5 mr-3 text-primary" />
                            <span>My Wishlist</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto py-6 flex justify-between items-center"
                        onClick={() => navigate("/cart")}
                    >
                        <div className="flex items-center">
                            <ShoppingCart className="h-5 w-5 mr-3 text-primary" />
                            <span>Shopping Cart</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto py-6 flex justify-between items-center"
                        onClick={() => navigate("/inventory")}
                    >
                        <div className="flex items-center">
                            <Package className="h-5 w-5 mr-3 text-primary" />
                            <span>Game Library</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Account Management */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Account Management</h2>
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        className="w-full justify-start py-3 px-4 bg-secondary/50 hover:bg-secondary"
                        onClick={() => navigate("/payment-methods")}
                    >
                        <CreditCard className="h-5 w-5 mr-3" />
                        <span>Payment Methods</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start py-3 px-4 bg-secondary/50 hover:bg-secondary"
                        onClick={() => navigate("/notifications")}
                    >
                        <Bell className="h-5 w-5 mr-3" />
                        <span>Notifications</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start py-3 px-4 bg-secondary/50 hover:bg-secondary"
                        onClick={() => navigate("/settings")}
                    >
                        <Settings className="h-5 w-5 mr-3" />
                        <span>Account Settings</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start py-3 px-4 bg-secondary/50 hover:bg-secondary text-destructive hover:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>

            {/* Account Stats */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Account Stats</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Games Owned</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Wishlist Items</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Cart Items</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Reviews</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

