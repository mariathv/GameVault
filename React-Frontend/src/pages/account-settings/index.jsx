"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Shield, Lock, User, Bell, CreditCard, LogOut, Check, Save } from "lucide-react"
import { useAuth } from "@/src/contexts/auth-context"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Replace fetchData with apiRequest
import { apiRequest } from "@/src/hooks/api/api-gamevault"

// Add these imports at the top of the file
import { getUserInventory } from "@/src/api/inventory"
import { getWishlist } from "@/src/hooks/useWishlist"

// Account Statistics Component
const AccountStatistics = ({ userId }) => {
  const [stats, setStats] = useState({
    gamesOwned: 0,
    wishlistItems: 0,
    totalSpending: 0,
    isLoading: true,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch inventory data
        const inventoryData = await getUserInventory(userId)

        // Fetch wishlist data
        const wishlistData = await getWishlist(userId)

        // Calculate statistics
        const gamesOwned =
          inventoryData?.inventory?.reduce((total, order) => total + (order.games?.length || 0), 0) || 0

        const wishlistItems = wishlistData?.wishlist?.games?.length || 0

        // Calculate total spending from all orders
        const totalSpending =
          inventoryData?.inventory?.reduce((total, order) => total + (order.totalAmount || 0), 0) || 0

        setStats({
          gamesOwned,
          wishlistItems,
          totalSpending,
          isLoading: false,
        })
      } catch (error) {
        console.error("Error fetching account statistics:", error)
        setStats((prev) => ({ ...prev, isLoading: false }))
      }
    }

    if (userId) {
      fetchStats()
    }
  }, [userId])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-(--color-background)/60 p-4 rounded-lg">
        <p className="text-(--color-foreground) text-sm">Games Owned</p>
        {stats.isLoading ? (
          <div className="h-8 w-16 bg-(--color-background)/80 animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-(--color-foreground)/80">{stats.gamesOwned}</p>
        )}
      </div>
      <div className="bg-(--color-background)/60 p-4 rounded-lg">
        <p className="text-(--color-foreground) text-sm">Wishlist Items</p>
        {stats.isLoading ? (
          <div className="h-8 w-16 bg-(--color-background)/80  animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-(--color-foreground)/80">{stats.wishlistItems}</p>
        )}
      </div>
      <div className="bg-(--color-background)/60 p-4 rounded-lg">
        <p className="text-(--color-foreground) text-sm">Total Spending</p>
        {stats.isLoading ? (
          <div className="h-8 w-16 bg-(--color-background)/80  animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-(--color-foreground)/80">${stats.totalSpending.toFixed(2)}</p>
        )}
      </div>
    </div>
  )
}

export default function AccountSettingsPage() {
  const navigate = useNavigate()
  // Make sure to destructure updateUser from useAuth
  const { user, logout, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [notification, setNotification] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  // Form states
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    showPlaytime: true,
    showWishlist: true,
    showLibrary: true,
    allowFriendRequests: true,
    shareActivityFeed: true,
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    gameUpdates: true,
    friendActivity: true,
    specialOffers: true,
    newReleases: true,
  })

  // Show notification function
  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    // Auto-hide notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }



  // Update the handleSaveProfile function to use apiRequest
  const handleSaveProfile = async () => {
    try {
      setNotification(null)

      // Validate input
      if (!formData.username.trim()) {
        showNotification("Username cannot be empty", "error")
        return
      }

      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        showNotification("Please enter a valid email address", "error")
        return
      }

      // Make API call to update profile
      const response = await apiRequest(
        "auth/update-profile",
        {
          username: formData.username,
          email: formData.email,
        },
        "PATCH",
      )

      if (response.status === "success") {
        // Update user context with new data
        if (response.data && response.data.user) {
          updateUser(response.data.user)
        }

        showNotification("Profile updated successfully", "success")
        setIsEditing(false)
      } else {
        showNotification(response.message || "Failed to update profile", "error")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      showNotification("An error occurred while updating your profile", "error")
    }
  }

  // Update the handleChangePassword function to use apiRequest
  const handleChangePassword = async () => {
    try {
      setNotification(null)

      // Validate input
      if (!formData.currentPassword) {
        showNotification("Current password is required", "error")
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        showNotification("New passwords don't match", "error")
        return
      }

      if (formData.newPassword.length < 8) {
        showNotification("Password must be at least 8 characters", "error")
        return
      }

      // Make API call to change password
      const response = await apiRequest(
        "auth/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        "PATCH",
      )

      if (response.status === "success") {
        // Update token if a new one is provided - use the correct key
        if (response.token) {
          localStorage.setItem("gamevault_token", response.token)
        }

        showNotification("Password changed successfully", "success")

        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        showNotification(response.message || "Failed to change password", "error")
      }
    } catch (error) {
      console.error("Password change error:", error)
      showNotification("An error occurred while changing your password", "error")
    }
  }

  const handle2FASetup = () => {
    if (!is2FAEnabled) {
      // Show QR code for setup
      setShowQRCode(true)
    } else {
      // Disable 2FA
      setIs2FAEnabled(false)
      setShowQRCode(false)
      showNotification("Two-factor authentication disabled", "success")
    }
  }

  const handleVerify2FA = () => {
    // Here you would implement the verification logic
    if (verificationCode.length === 6) {
      setIs2FAEnabled(true)
      setShowQRCode(false)
      showNotification("Two-factor authentication enabled", "success")
    } else {
      showNotification("Invalid verification code", "error")
    }
  }

  const handleCancel2FA = () => {
    setShowQRCode(false)
    setVerificationCode("")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-(--color-background)">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <User className="h-16 w-16 text-gray-700 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-white">Please log in to access account settings</h2>
            <p className="text-gray-400 mb-6 max-w-md">You need to be logged in to manage your account settings</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition"
            >
              Log In
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-(--color-background)">
      {/* Notification component */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-(--color-foreground) mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-(--color-background) rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3 mb-6 p-2">
                <div className="w-12 h-12 rounded-full bg-[#2a3349] flex items-center justify-center text-white text-xl font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="text-(--color-foreground) font-medium">{user.username || "User"}</h3>
                  <p className="text-(--color-foreground) text-sm">{user.email || "user@example.com"}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition ${
                    activeTab === "profile"
                      ? "bg-(--color-foreground)/20 text-(--color-foreground)"
                      : "text-(--color-foreground) bg-(--color-background) hover:text-(--color-foreground)"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition ${
                    activeTab === "security"
                      ? "bg-(--color-foreground)/20 text-(--color-foreground)"
                      : "text-(--color-foreground) bg-(--color-background) hover:text-(--color-foreground)"
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  <span>Security</span>
                </button>

                {/* <button
                  onClick={() => setActiveTab("privacy")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition ${activeTab === "privacy"
                    ? "bg-[#2a3349] text-white"
                    : "text-gray-400 hover:bg-[#2a3349]/50 hover:text-white"
                    }`}
                >
                  <Eye className="h-5 w-5" />
                  <span>Privacy</span>
                </button> */}


                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition ${
                    activeTab === "payment"
                      ? "bg-(--color-foreground)/20 text-(--color-foreground)"
                      : "text-(--color-foreground) bg-(--color-background) hover:text-(--color-foreground)"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Methods</span>
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="bg-(--color-background) rounded-lg shadow-lg overflow-hidden">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-(--color-foreground)">Profile Information</h2>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-[#2a3349] text-(--color-foreground) hover:bg-[#2a3349]"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-(--color-foreground)">
                            Username
                          </Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="bg-(--color-background)/60 border-[#2a3349] text-(--color-foreground)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-(--color-foreground)">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-(--color-background)/60 border-[#2a3349] text-(--color-foreground)"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button onClick={handleSaveProfile} className="bg-white text-black hover:bg-gray-200">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-gray-400 text-sm mb-1">Username</h3>
                          <p className="text-(--color-foreground)">{user.username || "Username not set"}</p>
                        </div>
                        <div>
                          <h3 className="text-gray-400 text-sm mb-1">Email</h3>
                          <p className="text-(--color-foreground)">{user.email || "Email not set"}</p>
                        </div>
                      </div>
                      
                    </div>
                  )}

                  <div className="mt-8 pt-8 border-t border-[#2a3349]">
                    <h3 className="text-xl font-bold text-white mb-4">Account Statistics</h3>
                    <AccountStatistics userId={user._id} />
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-(--color-foreground)/90 mb-6">Security Settings</h2>

                  <div className="space-y-8">
                    {/* Password Change Section */}
                    <div className="bg-(--color-background)/60 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-(--color-foreground)/90 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-(--color-foreground)">
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="bg-(--color-background) border-[#2a3349] text-(--color-foreground)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-(--color-foreground)">
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="bg-(--color-background) border-[#2a3349] text-(--color-foreground)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-(--color-foreground)">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="bg-(--color-background) border-[#2a3349] text-(--color-foreground)"
                          />
                        </div>
                        <Button onClick={handleChangePassword} className="bg-white text-black hover:bg-gray-200 mt-2">
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </Button>
                      </div>
                    </div>

                    {/* 2FA Section */}
                    <div className="bg-(--color-background) p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-(--color-foreground)">Two-Factor Authentication</h3>
                        <div className="flex items-center">
                          <span className={`mr-2 text-sm ${is2FAEnabled ? "text-green-400" : "text-gray-400"}`}>
                            {is2FAEnabled ? "Enabled" : "Disabled"}
                          </span>
                          <Button
                            variant="outline"
                            onClick={handle2FASetup}
                            className={`border-[#2a3349] ${is2FAEnabled ? "text-red-400 hover:bg-red-500/10 hover:text-red-300" : "text-(--color-foreground) hover:bg-(--color-background)/80"}`}
                          >
                            {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-400 mb-4">
                        Two-factor authentication adds an extra layer of security to your account by requiring a
                        verification code in addition to your password.
                      </p>

                      {showQRCode && (
                        <div className="mt-4 p-4 bg-[#2a3349] rounded-lg">
                          <h4 className="text-white font-medium mb-3">Setup Two-Factor Authentication</h4>
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm mb-4">
                              1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                            </p>
                            <div className="bg-white p-4 w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                              {/* Placeholder for QR code */}
                              <div className="text-black text-center">
                                <p className="font-bold">QR Code</p>
                                <p className="text-xs">Scan with authenticator app</p>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">
                              2. Enter the 6-digit verification code from your authenticator app
                            </p>
                            <div className="flex space-x-2">
                              <Input
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                maxLength={6}
                                placeholder="000000"
                                className="bg-[#1a2234] border-[#2a3349] text-white"
                              />
                              <Button onClick={handleVerify2FA} className="bg-white text-black hover:bg-gray-200">
                                Verify
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleCancel2FA}
                                className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {is2FAEnabled && (
                        <div className="mt-4 p-4 bg-[#2a3349] rounded-lg">
                          <div className="flex items-center text-green-400 mb-2">
                            <Check className="h-5 w-5 mr-2" />
                            <span className="font-medium">Two-factor authentication is enabled</span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Your account is now protected with an additional layer of security.
                          </p>
                        </div>
                      )}
                    </div>

                   
                  </div>
                </div>
              )}

              

              {/* Payment Methods Tab */}
              {activeTab === "payment" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-(--color-foreground) mb-6">Payment Methods</h2>

                  <div className="space-y-6">
                    <div className="bg-(--color-background) p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-(--color-foreground)">Saved Payment Methods</h3>
                        <Button className="bg-white text-black hover:bg-gray-200">Add New Payment Method</Button>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-(--color-background)/80 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-10 h-6 bg-blue-500 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">
                                VISA
                              </div>
                              <div>
                                <p className="text-(--color-foreground)">•••• •••• •••• 4242</p>
                                <p className="text-gray-400 text-sm">Expires 12/25</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="text-(--color-foreground) hover:bg-(--color-background)/60">
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-(--color-background)/80 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-(--color-foreground) mb-4">Billing Address</h3>

                      <div className="p-4 bg-(--color-background)/80 rounded-lg mb-4">
                        <p className="text-(--color-foreground)">John Doe</p>
                        <p className="text-gray-400">123 Gaming Street</p>
                        <p className="text-gray-400">New York, NY 10001</p>
                        <p className="text-gray-400">United States</p>
                      </div>

                      <Button variant="outline" className="border-[#2a3349] text-(--color-foreground) hover:bg-(--color-background)/60">
                        Edit Billing Address
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}