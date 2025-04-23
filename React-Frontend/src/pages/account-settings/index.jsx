"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Shield, Lock, User, Bell, Eye, CreditCard, HardDrive, LogOut, Check, Save } from "lucide-react"
import { useAuth } from "@/src/contexts/auth-context"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AccountSettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
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

  const handlePrivacyToggle = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    })
    showNotification("Privacy setting updated", "success")
  }

  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
    showNotification("Notification setting updated", "success")
  }

  const handleSaveProfile = () => {
    // Here you would implement the API call to update the user profile
    showNotification("Profile updated successfully", "success")
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      showNotification("New passwords don't match", "error")
      return
    }

    if (formData.newPassword.length < 8) {
      showNotification("Password must be at least 8 characters", "error")
      return
    }

    // Here you would implement the API call to change the password
    showNotification("Password changed successfully", "success")
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
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
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${notification.type === "error" ? "bg-red-500" : "bg-green-500"
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
            <div className="bg-[#1a2234] rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3 mb-6 p-2">
                <div className="w-12 h-12 rounded-full bg-[#2a3349] flex items-center justify-center text-white text-xl font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="text-white font-medium">{user.username || "User"}</h3>
                  <p className="text-gray-400 text-sm">{user.email || "user@example.com"}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition ${activeTab === "profile"
                    ? "bg-[#2a3349] text-white"
                    : "text-gray-400 hover:bg-[#2a3349]/50 hover:text-white"
                    }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition ${activeTab === "security"
                    ? "bg-[#2a3349] text-white"
                    : "text-gray-400 hover:bg-[#2a3349]/50 hover:text-white"
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
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition ${activeTab === "notifications"
                    ? "bg-[#2a3349] text-white"
                    : "text-gray-400 hover:bg-[#2a3349]/50 hover:text-white"
                    }`}
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </button>

                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition ${activeTab === "payment"
                    ? "bg-[#2a3349] text-white"
                    : "text-gray-400 hover:bg-[#2a3349]/50 hover:text-white"
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
            <div className="bg-[#1a2234] rounded-lg shadow-lg overflow-hidden">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-white">
                            Username
                          </Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="bg-[#0f1623] border-[#2a3349] text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-[#0f1623] border-[#2a3349] text-white"
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
                          <p className="text-white">{user.username || "Username not set"}</p>
                        </div>
                        <div>
                          <h3 className="text-gray-400 text-sm mb-1">Email</h3>
                          <p className="text-white">{user.email || "Email not set"}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">Account Created</h3>
                        <p className="text-white">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-8 border-t border-[#2a3349]">
                    <h3 className="text-xl font-bold text-white mb-4">Account Statistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#2a3349] p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Games Owned</p>
                        <p className="text-2xl font-bold text-white">{user.gamesCount || 0}</p>
                      </div>
                      <div className="bg-[#2a3349] p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Wishlist Items</p>
                        <p className="text-2xl font-bold text-white">{user.wishlistCount || 0}</p>
                      </div>
                      <div className="bg-[#2a3349] p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Total Spending</p>
                        <p className="text-2xl font-bold text-white">{user.wishlistCount || 0}</p>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

                  <div className="space-y-8">
                    {/* Password Change Section */}
                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-white">
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="bg-[#1a2234] border-[#2a3349] text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-white">
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="bg-[#1a2234] border-[#2a3349] text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-white">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="bg-[#1a2234] border-[#2a3349] text-white"
                          />
                        </div>
                        <Button onClick={handleChangePassword} className="bg-white text-black hover:bg-gray-200 mt-2">
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </Button>
                      </div>
                    </div>

                    {/* 2FA Section */}
                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Two-Factor Authentication</h3>
                        <div className="flex items-center">
                          <span className={`mr-2 text-sm ${is2FAEnabled ? "text-green-400" : "text-gray-400"}`}>
                            {is2FAEnabled ? "Enabled" : "Disabled"}
                          </span>
                          <Button
                            variant="outline"
                            onClick={handle2FASetup}
                            className={`border-[#2a3349] ${is2FAEnabled ? "text-red-400 hover:bg-red-500/10 hover:text-red-300" : "text-white hover:bg-[#2a3349]"}`}
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

                    {/* Login Sessions */}
                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-4">Active Sessions</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#2a3349] rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-white font-medium">Current Session</p>
                              <p className="text-gray-400 text-sm">Windows • Chrome • Last active now</p>
                            </div>
                            <div className="flex items-center text-green-400">
                              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                              <span className="text-sm">Active</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out All Other Devices
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {/* {activeTab === "privacy" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Privacy Settings</h2>

                  <div className="space-y-6">
                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-4">Profile Privacy</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Show Online Status</p>
                            <p className="text-gray-400 text-sm">Allow others to see when you're online</p>
                          </div>
                          <Switch
                            checked={privacySettings.showOnlineStatus}
                            onCheckedChange={() => handlePrivacyToggle("showOnlineStatus")}
                            className="data-[state=checked]:bg-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Show Game Playtime</p>
                            <p className="text-gray-400 text-sm">Allow others to see how long you've played games</p>
                          </div>
                          <Switch
                            checked={privacySettings.showPlaytime}
                            onCheckedChange={() => handlePrivacyToggle("showPlaytime")}
                            className="data-[state=checked]:bg-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Public Wishlist</p>
                            <p className="text-gray-400 text-sm">Allow others to see games in your wishlist</p>
                          </div>
                          <Switch
                            checked={privacySettings.showWishlist}
                            onCheckedChange={() => handlePrivacyToggle("showWishlist")}
                            className="data-[state=checked]:bg-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Public Game Library</p>
                            <p className="text-gray-400 text-sm">Allow others to see games you own</p>
                          </div>
                          <Switch
                            checked={privacySettings.showLibrary}
                            onCheckedChange={() => handlePrivacyToggle("showLibrary")}
                            className="data-[state=checked]:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-4">Social Privacy</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Allow Friend Requests</p>
                            <p className="text-gray-400 text-sm">Allow other users to send you friend requests</p>
                          </div>
                          <Switch
                            checked={privacySettings.allowFriendRequests}
                            onCheckedChange={() => handlePrivacyToggle("allowFriendRequests")}
                            className="data-[state=checked]:bg-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Share Activity Feed</p>
                            <p className="text-gray-400 text-sm">Share your gaming activity with friends</p>
                          </div>
                          <Switch
                            checked={privacySettings.shareActivityFeed}
                            onCheckedChange={() => handlePrivacyToggle("shareActivityFeed")}
                            className="data-[state=checked]:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-4">Data Privacy</h3>

                      <div className="space-y-4">
                        <Button variant="outline" className="border-[#2a3349] text-white hover:bg-[#2a3349]">
                          Download My Data
                        </Button>

                        <Button
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>

                  <div className="space-y-6">
                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-4">Notification Channels</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Email Notifications</p>
                            <p className="text-gray-400 text-sm">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                            className="data-[state=checked]:bg-white"
                          />
                        </div>


                      </div>
                    </div>

                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-4">Notification Types</h3>

                      <div className="space-y-4">

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Special Offers</p>
                            <p className="text-gray-400 text-sm">Discounts and special promotions</p>
                          </div>
                          <Switch
                            checked={notificationSettings.specialOffers}
                            onCheckedChange={() => handleNotificationToggle("specialOffers")}
                            className="data-[state=checked]:bg-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">New Releases</p>
                            <p className="text-gray-400 text-sm">Notifications about new game releases</p>
                          </div>
                          <Switch
                            checked={notificationSettings.newReleases}
                            onCheckedChange={() => handleNotificationToggle("newReleases")}
                            className="data-[state=checked]:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === "payment" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Payment Methods</h2>

                  <div className="space-y-6">
                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Saved Payment Methods</h3>
                        <Button className="bg-white text-black hover:bg-gray-200">Add New Payment Method</Button>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-[#2a3349] rounded-lg">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-10 h-6 bg-blue-500 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">
                                VISA
                              </div>
                              <div>
                                <p className="text-white">•••• •••• •••• 4242</p>
                                <p className="text-gray-400 text-sm">Expires 12/25</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="text-white hover:bg-[#1a2234]">
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

                    <div className="bg-[#0f1623] p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-4">Billing Address</h3>

                      <div className="p-4 bg-[#2a3349] rounded-lg mb-4">
                        <p className="text-white">John Doe</p>
                        <p className="text-gray-400">123 Gaming Street</p>
                        <p className="text-gray-400">New York, NY 10001</p>
                        <p className="text-gray-400">United States</p>
                      </div>

                      <Button variant="outline" className="border-[#2a3349] text-white hover:bg-[#2a3349]">
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
