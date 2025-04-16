"use client"

import { useState, useEffect } from "react"
import { Save, Moon, Sun, Bell, Shield, Key, Globe, AlertCircle, Trash2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { CustomToggle } from "../components/custom-toggle"
import { useTheme } from "../contexts/theme-context"

export default function SettingsPage() {
    const [isMounted, setIsMounted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [settings, setSettings] = useState({
        general: {
            storeName: "GameVault",
            contactEmail: "admin@gamevault.com",
            currency: "USD",
            language: "en",
            timezone: "UTC",
        },
        notifications: {
            emailNotifications: true,
            salesAlerts: true,
            lowInventoryAlerts: true,
            newUserRegistrations: false,
            systemUpdates: true,
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: "30",
            ipRestriction: false,
            allowedIPs: "",
            passwordExpiry: "90",
        },
        api: {
            enableAPI: true,
            apiKey: "gv_api_xxxxxxxxxxxxxxxxxxxx",
            webhookURL: "",
            rateLimiting: true,
        },
    })

    // Ensure theme switcher only renders client-side
    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleSaveSettings = () => {
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            toast.success("Settings saved successfully")
        }, 800)
    }

    const handleResetSettings = (section) => {
        const defaultSettings = {
            general: {
                storeName: "GameVault",
                contactEmail: "admin@gamevault.com",
                currency: "USD",
                language: "en",
                timezone: "UTC",
            },
            notifications: {
                emailNotifications: true,
                salesAlerts: true,
                lowInventoryAlerts: true,
                newUserRegistrations: false,
                systemUpdates: true,
            },
            security: {
                twoFactorAuth: false,
                sessionTimeout: "30",
                ipRestriction: false,
                allowedIPs: "",
                passwordExpiry: "90",
            },
            api: {
                enableAPI: true,
                apiKey: "gv_api_xxxxxxxxxxxxxxxxxxxx",
                webhookURL: "",
                rateLimiting: true,
            },
        }

        setSettings({
            ...settings,
            [section]: defaultSettings[section],
        })

        toast.info(`${section.charAt(0).toUpperCase() + section.slice(1)} settings reset to default`)
    }

    const handleInputChange = (section, field, value) => {
        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [field]: value,
            },
        })
    }

    const regenerateAPIKey = () => {
        const newKey = "gv_api_" + Math.random().toString(36).substring(2, 15)
        handleInputChange("api", "apiKey", newKey)
        toast.success("API key regenerated successfully")
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-(--color-background) flex flex-col items-center justify-center text-(--color-foreground)">
                <div className="loader border-t-4 border-(--color-accent-primary) rounded-full w-12 h-12 animate-spin"></div>
            </div>
        )
    }

    const { theme, toggleTheme } = useTheme()

    return (
        <div className="mt-4 sm:mt-6 md:mt-8 px-3 sm:px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-(--color-foreground) mb-3 sm:mb-0">Settings</h1>
                <div className="flex items-center space-x-4">
                    {isMounted && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleTheme}
                            className="border-(--color-border) text-(--color-foreground) hover:bg-(--color-background-t)/50"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5 " />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                    )}
                    <Button
                        className="bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80 text-(--color-foreground)"
                        onClick={handleSaveSettings}
                    >
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-(--color-background-t) border-(--color-border) text-(--color-foreground) p-1">
                    <TabsTrigger
                        value="general"
                        className="data-[state=active]:bg-(--color-accent-primary) data-[state=active]:text-(--color-foreground)"
                    >
                        <Globe className="h-4 w-4 mr-2" /> General
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="data-[state=active]:bg-(--color-accent-primary) data-[state=active]:text-(--color-foreground)"
                    >
                        <Bell className="h-4 w-4 mr-2" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="data-[state=active]:bg-(--color-accent-primary) data-[state=active]:text-(--color-foreground)"
                    >
                        <Shield className="h-4 w-4 mr-2" /> Security
                    </TabsTrigger>
                    <TabsTrigger
                        value="api"
                        className="data-[state=active]:bg-(--color-accent-primary) data-[state=active]:text-(--color-foreground)"
                    >
                        <Key className="h-4 w-4 mr-2" /> API
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                    <Card className="bg-(--color-background) border-(--color-border) text-(--color-foreground)">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle>General Settings</CardTitle>
                                <CardDescription className="text-(--color-foreground)/70">
                                    Configure your store's basic information and preferences
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-(--color-border) text-(--color-foreground) hover:bg-(--color-background-t)/50"
                                onClick={() => handleResetSettings("general")}
                            >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Store Name</Label>
                                    <Input
                                        id="storeName"
                                        placeholder="Your store name"
                                        className="bg-(--color-background) border-(--color-border) text-(--color-foreground)"
                                        value={settings.general.storeName}
                                        onChange={(e) => handleInputChange("general", "storeName", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Contact Email</Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        placeholder="admin@example.com"
                                        className="bg-(--color-background) border-(--color-border) text-(--color-foreground)"
                                        value={settings.general.contactEmail}
                                        onChange={(e) => handleInputChange("general", "contactEmail", e.target.value)}
                                    />
                                </div>
                            </div>

                            <Separator className="bg-(--color-border)" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select
                                        value={settings.general.currency}
                                        onValueChange={(value) => handleInputChange("general", "currency", value)}
                                    >
                                        <SelectTrigger className="bg-(--color-background) border-(--color-border) text-(--color-foreground)">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-(--color-background-t) border-(--color-border) text-(--color-foreground)">
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                                            <SelectItem value="CAD">CAD ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select
                                        value={settings.general.language}
                                        onValueChange={(value) => handleInputChange("general", "language", value)}
                                    >
                                        <SelectTrigger className="bg-(--color-background) border-(--color-border) text-(--color-foreground)">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-(--color-background-t) border-(--color-border) text-(--color-foreground)">
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="de">German</SelectItem>
                                            <SelectItem value="ja">Japanese</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select
                                        value={settings.general.timezone}
                                        onValueChange={(value) => handleInputChange("general", "timezone", value)}
                                    >
                                        <SelectTrigger className="bg-(--color-background) border-(--color-border) text-(--color-foreground)">
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-(--color-background-t) border-(--color-border) text-(--color-foreground)">
                                            <SelectItem value="UTC">UTC</SelectItem>
                                            <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                                            <SelectItem value="CST">Central Time (CST)</SelectItem>
                                            <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                                            <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications">
                    <Card className="bg-(--color-background) border-(--color-border) text-(--color-foreground)">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle>Notification Settings</CardTitle>
                                <CardDescription className="text-(--color-foreground)/70">
                                    Configure how and when you receive notifications
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-(--color-border) text-(--color-foreground) hover:bg-(--color-background-t)/50"
                                onClick={() => handleResetSettings("notifications")}
                            >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                                        <p className="text-sm text-(--color-foreground)/70">Receive notifications via email</p>
                                    </div>
                                    <CustomToggle
                                        id="emailNotifications"
                                        checked={settings.notifications.emailNotifications}
                                        onCheckedChange={(checked) => handleInputChange("notifications", "emailNotifications", checked)}
                                    />
                                </div>

                                <Separator className="bg-(--color-border)" />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="salesAlerts">Sales Alerts</Label>
                                        <p className="text-sm text-(--color-foreground)/70">Get notified when a new sale is made</p>
                                    </div>
                                    <CustomToggle
                                        id="salesAlerts"
                                        checked={settings.notifications.salesAlerts}
                                        onCheckedChange={(checked) => handleInputChange("notifications", "salesAlerts", checked)}
                                    />
                                </div>

                                <Separator className="bg-(--color-border)" />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="lowInventoryAlerts">Low Inventory Alerts</Label>
                                        <p className="text-sm text-(--color-foreground)/70">Get notified when game keys are running low</p>
                                    </div>
                                    <CustomToggle
                                        id="lowInventoryAlerts"
                                        checked={settings.notifications.lowInventoryAlerts}
                                        onCheckedChange={(checked) => handleInputChange("notifications", "lowInventoryAlerts", checked)}
                                    />
                                </div>

                                <Separator className="bg-(--color-border)" />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="newUserRegistrations">New User Registrations</Label>
                                        <p className="text-sm text-(--color-foreground)/70">Get notified when a new user registers</p>
                                    </div>
                                    <CustomToggle
                                        id="newUserRegistrations"
                                        checked={settings.notifications.newUserRegistrations}
                                        onCheckedChange={(checked) => handleInputChange("notifications", "newUserRegistrations", checked)}
                                    />
                                </div>

                                <Separator className="bg-(--color-border)" />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="systemUpdates">System Updates</Label>
                                        <p className="text-sm text-(--color-foreground)/70">
                                            Get notified about system updates and maintenance
                                        </p>
                                    </div>
                                    <CustomToggle
                                        id="systemUpdates"
                                        checked={settings.notifications.systemUpdates}
                                        onCheckedChange={(checked) => handleInputChange("notifications", "systemUpdates", checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security">
                    <Card className="bg-(--color-background) border-(--color-border) text-(--color-foreground)">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription className="text-(--color-foreground)/70">
                                    Configure security options for your admin account
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-(--color-border) text-(--color-foreground) hover:bg-(--color-background-t)/50"
                                onClick={() => handleResetSettings("security")}
                            >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                                    <p className="text-sm text-(--color-foreground)/70">Require a verification code when logging in</p>
                                </div>
                                <CustomToggle
                                    id="twoFactorAuth"
                                    checked={settings.security.twoFactorAuth}
                                    onCheckedChange={(checked) => handleInputChange("security", "twoFactorAuth", checked)}
                                />
                            </div>

                            <Separator className="bg-(--color-border)" />

                            <div className="space-y-2">
                                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                <Input
                                    id="sessionTimeout"
                                    type="number"
                                    placeholder="30"
                                    className="bg-(--color-background) border-(--color-border) text-(--color-foreground)"
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) => handleInputChange("security", "sessionTimeout", e.target.value)}
                                />
                                <p className="text-sm text-(--color-foreground)/70">Automatically log out after inactivity</p>
                            </div>

                            <Separator className="bg-(--color-border)" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="ipRestriction">IP Restriction</Label>
                                        <p className="text-sm text-(--color-foreground)/70">Limit admin access to specific IP addresses</p>
                                    </div>
                                    <CustomToggle
                                        id="ipRestriction"
                                        checked={settings.security.ipRestriction}
                                        onCheckedChange={(checked) => handleInputChange("security", "ipRestriction", checked)}
                                    />
                                </div>

                                {settings.security.ipRestriction && (
                                    <div className="space-y-2">
                                        <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                                        <Input
                                            id="allowedIPs"
                                            placeholder="192.168.1.1, 10.0.0.1"
                                            className="bg-(--color-background) border-(--color-border) text-(--color-foreground)"
                                            value={settings.security.allowedIPs}
                                            onChange={(e) => handleInputChange("security", "allowedIPs", e.target.value)}
                                        />
                                        <p className="text-sm text-(--color-foreground)/70">Comma-separated list of allowed IPs</p>
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-(--color-border)" />

                            <div className="space-y-2">
                                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                                <Input
                                    id="passwordExpiry"
                                    type="number"
                                    placeholder="90"
                                    className="bg-(--color-background) border-(--color-border) text-(--color-foreground)"
                                    value={settings.security.passwordExpiry}
                                    onChange={(e) => handleInputChange("security", "passwordExpiry", e.target.value)}
                                />
                                <p className="text-sm text-(--color-foreground)/70">
                                    Force password change after specified days (0 to disable)
                                </p>
                            </div>

                            <Separator className="bg-(--color-border)" />

                            <div className="pt-2">
                                <Button variant="destructive" className="bg-[#FE9A9A]/80 hover:bg-[#FE9A9A] text-[#1D2127]">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete All Sessions
                                </Button>
                                <p className="text-sm text-(--color-foreground)/70 mt-2">
                                    This will log out all devices currently signed in to your account
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* API Settings */}
                <TabsContent value="api">
                    <Card className="bg-(--color-background) border-(--color-border) text-(--color-foreground)">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle>API Settings</CardTitle>
                                <CardDescription className="text-(--color-foreground)/70">
                                    Configure API access for third-party integrations
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-(--color-border) text-(--color-foreground) hover:bg-(--color-background-t)/50"
                                onClick={() => handleResetSettings("api")}
                            >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="enableAPI">Enable API Access</Label>
                                    <p className="text-sm text-(--color-foreground)/70">
                                        Allow external applications to access your store data
                                    </p>
                                </div>
                                <CustomToggle
                                    id="enableAPI"
                                    checked={settings.api.enableAPI}
                                    onCheckedChange={(checked) => handleInputChange("api", "enableAPI", checked)}
                                />
                            </div>

                            <Separator className="bg-(--color-border)" />

                            <div className="space-y-2">
                                <Label htmlFor="apiKey">API Key</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="apiKey"
                                        className="bg-(--color-background) border-(--color-border) text-(--color-foreground) font-mono"
                                        value={settings.api.apiKey}
                                        readOnly
                                    />
                                    <Button
                                        variant="outline"
                                        className="border-(--color-border) text-(--color-foreground) hover:bg-(--color-background-t)/50"
                                        onClick={regenerateAPIKey}
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-(--color-foreground)/70 flex items-center">
                                    <AlertCircle className="h-3.5 w-3.5 mr-1 text-[#FE9A9A]" />
                                    Keep this key secret. Regenerate if compromised.
                                </p>
                            </div>

                            <Separator className="bg-(--color-border)" />

                            <div className="space-y-2">
                                <Label htmlFor="webhookURL">Webhook URL</Label>
                                <Input
                                    id="webhookURL"
                                    placeholder="https://example.com/webhook"
                                    className="bg-(--color-background) border-(--color-border) text-(--color-foreground)"
                                    value={settings.api.webhookURL}
                                    onChange={(e) => handleInputChange("api", "webhookURL", e.target.value)}
                                />
                                <p className="text-sm text-(--color-foreground)/70">URL to receive event notifications</p>
                            </div>

                            <Separator className="bg-(--color-border)" />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="rateLimiting">Rate Limiting</Label>
                                    <p className="text-sm text-(--color-foreground)/70">Limit API requests to prevent abuse</p>
                                </div>
                                <CustomToggle
                                    id="rateLimiting"
                                    checked={settings.api.rateLimiting}
                                    onCheckedChange={(checked) => handleInputChange("api", "rateLimiting", checked)}
                                />
                            </div>

                            <Separator className="bg-(--color-border)" />

                            <div className="pt-2">
                                <Button
                                    variant="outline"
                                    className="border-(--color-border) text-(--color-foreground) hover:bg-(--color-background-t)/50"
                                >
                                    View API Documentation
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
