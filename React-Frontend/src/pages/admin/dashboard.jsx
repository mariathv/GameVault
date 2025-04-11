"use client"

import { useState, useEffect } from "react"
import {
    Activity,
    ShoppingCart,
    Package,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    ChevronRight,
    Search,
    Plus,
    Edit,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchDataDummy } from "@/src/hooks/api/api-gamevault"
import { useNavigate } from "react-router-dom"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { getGameCount } from "@/src/api/store"

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalGames: 0,
        totalSales: 0,
        totalRevenue: 0,
        activeUsers: 0,
    })
    const [recentGames, setRecentGames] = useState([])
    const [recentPurchases, setRecentPurchases] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                // In a real implementation, these would be actual API calls
                // For now, we'll simulate the data
                //----------- get games count ----------------
                const gameCount = await getGameCount();
                console.log("gamecount", gameCount);
                if (gameCount.success) {
                    setStats({
                        totalGames: gameCount.total,
                        totalSales: 128,
                        totalRevenue: 3749.99,
                        activeUsers: 237,
                    })
                }

                // Fetch store stats
                // const storeStats = await fetchDataDummy("store/stats")
                // if (storeStats) {
                //     setStats({
                //         totalGames: storeStats.totalGames || 45,
                //         totalSales: storeStats.totalSales || 128,
                //         totalRevenue: storeStats.totalRevenue || 3749.99,
                //         activeUsers: storeStats.activeUsers || 237,
                //     })
                // }

                // Fetch recent games
                const gamesResponse = await fetchDataDummy("store/games/get-all?limit=5")
                if (gamesResponse && gamesResponse.games) {
                    setRecentGames(gamesResponse.games.slice(0, 5))
                } else {
                    // Fallback sample data
                    setRecentGames([
                        { id: 1, name: "Cyberpunk 2077", price: 59.99, cover_url: "/placeholder.svg?height=120&width=90" },
                        { id: 2, name: "Elden Ring", price: 49.99, cover_url: "/placeholder.svg?height=120&width=90" },
                        { id: 3, name: "Red Dead Redemption 2", price: 39.99, cover_url: "/placeholder.svg?height=120&width=90" },
                        { id: 4, name: "The Witcher 3", price: 29.99, cover_url: "/placeholder.svg?height=120&width=90" },
                    ])
                }

                // Fetch recent purchases
                const purchasesResponse = await fetchDataDummy("store/purchases/recent")
                if (purchasesResponse && purchasesResponse.purchases) {
                    setRecentPurchases(purchasesResponse.purchases)
                } else {
                    // Fallback sample data
                    setRecentPurchases([
                        { id: 1, game: "Cyberpunk 2077", user: "user@example.com", date: "2023-04-15", price: 59.99 },
                        { id: 2, game: "Elden Ring", user: "player@example.com", date: "2023-04-14", price: 49.99 },
                        { id: 3, game: "Red Dead Redemption 2", user: "gamer@example.com", date: "2023-04-13", price: 39.99 },
                    ])
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const navigateTo = (path) => {
        navigate(path)
    }

    return (
        <div className="mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-3xl font-bold text-[#EDEDED] mb-4 md:mb-0">Dashboard</h1>
                <div className="flex space-x-4">
                    <Button className="bg-[#668389] hover:bg-[#668389]/80 text-white" onClick={() => navigateTo("/add-game")}>
                        <Plus className="mr-2 h-4 w-4" /> Add Game
                    </Button>
                    <Button
                        variant="outline"
                        className="border-[#3D4247] text-[#EDEDED] hover:bg-[#2D3237]"
                        onClick={() => navigateTo("/view-games")}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Manage Games
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-[#1D2127] border-[#2D3237] text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                        <Package className="h-4 w-4 text-[#668389]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalGames}</div>
                        <p className="text-xs text-[#DDD9FE]/70">Games in store</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#1D2127] border-[#2D3237] text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-[#668389]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSales}</div>
                        <p className="text-xs text-[#DDD9FE]/70">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#1D2127] border-[#2D3237] text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-[#668389]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-[#DDD9FE]/70">+8.2% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#1D2127] border-[#2D3237] text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-[#668389]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeUsers}</div>
                        <p className="text-xs text-[#DDD9FE]/70">+24 since yesterday</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Chart */}
                <Card className="bg-[#1D2127] border-[#2D3237] text-white lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Sales Overview</CardTitle>
                        <div className="flex items-center text-xs text-[#DDD9FE]/70">
                            <TrendingUp className="h-4 w-4 mr-1 text-[#668389]" />
                            <span>+12.5% from last month</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center">
                            {/* This would be a chart in a real implementation */}
                            <div className="w-full h-full relative">
                                <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-[#668389]/20 to-transparent rounded-md"></div>
                                <div className="absolute bottom-0 left-0 w-full h-[40%] flex items-end">
                                    <div className="w-1/7 h-[30%] bg-[#668389] mx-1 rounded-t-sm"></div>
                                    <div className="w-1/7 h-[45%] bg-[#668389] mx-1 rounded-t-sm"></div>
                                    <div className="w-1/7 h-[60%] bg-[#668389] mx-1 rounded-t-sm"></div>
                                    <div className="w-1/7 h-[40%] bg-[#668389] mx-1 rounded-t-sm"></div>
                                    <div className="w-1/7 h-[75%] bg-[#668389] mx-1 rounded-t-sm"></div>
                                    <div className="w-1/7 h-[90%] bg-[#668389] mx-1 rounded-t-sm"></div>
                                    <div className="w-1/7 h-[65%] bg-[#668389] mx-1 rounded-t-sm"></div>
                                </div>
                                <div className="absolute bottom-[-25px] left-0 w-full flex justify-between px-1 text-xs text-[#DDD9FE]/70">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-[#1D2127] border-[#2D3237] text-white">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentPurchases.map((purchase, index) => (
                                <div key={index} className="flex items-start pb-4 last:pb-0 border-b border-[#2D3237] last:border-0">
                                    <div className="rounded-full bg-[#2D3237] p-2 mr-4">
                                        <ShoppingCart className="h-4 w-4 text-[#668389]" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">New purchase: {purchase.game}</p>
                                        <p className="text-xs text-[#DDD9FE]/70">by {purchase.user}</p>
                                        <div className="flex items-center pt-1">
                                            <Clock className="h-3 w-3 text-[#DDD9FE]/70 mr-1" />
                                            <span className="text-xs text-[#DDD9FE]/70">{new Date(purchase.date).toLocaleDateString()}</span>
                                            <span className="ml-auto text-xs font-medium">${purchase.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Games */}
            <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#EDEDED]">Recent Games</h2>
                    <Button
                        variant="ghost"
                        className="text-[#668389] hover:text-[#668389]/80 hover:bg-[#2D3237]"
                        onClick={() => navigateTo("/view-games")}
                    >
                        View all <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {recentGames.map((game, index) => (
                        <Card key={index} className="bg-[#1D2127] border-[#2D3237] text-white overflow-hidden">
                            <div className="p-2">
                                <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-md">
                                    <img
                                        src={game.cover_url || "/placeholder.svg?height=240&width=180"}
                                        alt={game.name}
                                        className="object-cover w-full h-full"
                                    />
                                </AspectRatio>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-2 line-clamp-1">{game.name}</h3>
                                <div className="text-sm text-[#DDD9FE]/70 mb-4">Price: ${game.price}</div>
                                <Button
                                    className="w-full bg-[#668389]/80 hover:bg-[#668389]"
                                    onClick={() => navigateTo(`/view-games?id=${game.id}`)}
                                >
                                    <Edit className="mr-2 h-4 w-4" /> Edit Details
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 mb-6">
                <h2 className="text-xl font-bold text-[#EDEDED] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                        className="h-auto py-6 bg-[#1D2127] border border-[#2D3237] hover:bg-[#2D3237] text-white flex flex-col items-center"
                        onClick={() => navigateTo("/add-game")}
                    >
                        <Plus className="h-6 w-6 mb-2" />
                        <span>Add New Game</span>
                    </Button>
                    <Button
                        className="h-auto py-6 bg-[#1D2127] border border-[#2D3237] hover:bg-[#2D3237] text-white flex flex-col items-center"
                        onClick={() => navigateTo("/view-games")}
                    >
                        <Edit className="h-6 w-6 mb-2" />
                        <span>Manage Games</span>
                    </Button>
                    <Button
                        className="h-auto py-6 bg-[#1D2127] border border-[#2D3237] hover:bg-[#2D3237] text-white flex flex-col items-center"
                        onClick={() => navigateTo("/users")}
                    >
                        <Users className="h-6 w-6 mb-2" />
                        <span>Manage Users</span>
                    </Button>
                    <Button
                        className="h-auto py-6 bg-[#1D2127] border border-[#2D3237] hover:bg-[#2D3237] text-white flex flex-col items-center"
                        onClick={() => navigateTo("/help")}
                    >
                        <Activity className="h-6 w-6 mb-2" />
                        <span>View Help</span>
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mt-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search games, users, or purchases..."
                        className="w-full pl-10 pr-4 py-2 border-2 border-[#2D3237] rounded-full text-[#DDD9FE] bg-[#1D2127] focus:outline-none focus:border-[#668389]"
                    />
                </div>
            </div>
        </div>
    )
}

