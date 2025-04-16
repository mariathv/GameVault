"use client"

import { useState, useEffect } from "react"
import { Activity, ShoppingCart, Package, Users, DollarSign, TrendingUp, Clock, ChevronRight, Search, Plus, Edit, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchDataDummy } from "@/src/hooks/api/api-gamevault"
import { useNavigate } from "react-router-dom"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { getGameCount } from "@/src/api/store"
import Help from "./Help"
import { getGameSaleCount, getRecentOrders, getTotalRevenue, getWeeklySale } from "@/src/api/order"
import { getUsersCount } from "@/src/api/users"

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalGames: 0,
        totalSales: 0,
        totalRevenue: 0,
        activeUsers: 0,
    })
    const [statChanges, setStatChanges] = useState({
        salesChange: 0,
        revenueChange: 0,
        usersChange: 0,
    })
    const [recentGames, setRecentGames] = useState([])
    const [recentPurchases, setRecentPurchases] = useState([])
    const [loading, setLoading] = useState(true)
    const [weeklySaleData, setWeekSaleData] = useState([]);
    const [recentOrders, setRecentOrders] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                const now = new Date();
                const currentMonth = now.getMonth() + 1;
                const currentYear = now.getFullYear();

                console.log(`Current Month: ${currentMonth}, Current Year: ${currentYear}`);

                //----------- get games count ----------------
                const gameCount = await getGameCount();
                //----------- get orders count -----------------
                const orderCount = await getGameSaleCount(currentMonth, currentYear);
                //----------- get revenue --------------
                const thisMonthRevenue = await getTotalRevenue(currentMonth, currentYear);
                //------------ get users -----------
                const usersCount = await getUsersCount();
                setStats({
                    totalGames: (gameCount.success && gameCount.total) || 0,
                    totalSales: orderCount.count || 0,
                    totalRevenue: (thisMonthRevenue.success && thisMonthRevenue.totalRevenue) || 0,
                    activeUsers: (usersCount.success && usersCount.count) || 0,
                })
                setStatChanges({
                    salesChange: orderCount.percentageChange,
                    revenueChange: (thisMonthRevenue.success && thisMonthRevenue.totalRevenue) || 0,
                    usersChange: (usersCount.success && usersCount.change) || 0,
                })

                const weeklySale = await getWeeklySale();
                setWeekSaleData(weeklySale.data);

                const recentOrders = await getRecentOrders();
                setRecentOrders(recentOrders.orders);
                console.log(recentOrders.orders);




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

    if (loading) {
        return (
            <div className="min-h-screen bg-(--color-background-secondary) flex flex-col items-center justify-center text-(--color-foreground)">
                <div className="loader border-t-4 border-(--color-foreground)"></div> {/* Loader */}
            </div>
        )
    }

    return (
        <div className="mt-4 sm:mt-6 md:mt-8 px-3 sm:px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-(--color-light-ed) mb-3 sm:mb-0">Dashboard</h1>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button
                        className="bg-[#668389] hover:bg-[#668389]/80 text-(--color-light-ed) w-full sm:w-auto"
                        onClick={() => navigateTo("/admin/add-a-game")}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Game
                    </Button>
                    <Button
                        variant="outline"
                        className="border-[#3D4247] text-(--color-light-ed) hover:bg-(--color-light-ed)/5 w-full sm:w-auto"
                        onClick={() => navigateTo("/admin/view-games")}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Manage Games
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Card className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                        <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                        <Package className="h-4 w-4 text-[#668389]" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                        <div className="text-xl sm:text-2xl font-bold">{stats.totalGames}</div>
                        <p className="text-xs text-(--color-foreground)/70">Games in store</p>
                    </CardContent>
                </Card>

                <Card className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-[#668389]" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                        <div className="text-xl sm:text-2xl font-bold">{stats.totalSales}</div>
                        <p className="text-xs  text-(--color-foreground)/70">+{statChanges.salesChange}% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-[#668389]" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                        <div className="text-xl sm:text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs  text-(--color-foreground)/70">+{statChanges.revenueChange.toFixed(2)}% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-(--color-background) border-[#2D3237] text-(--color-foreground)">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-[#668389]" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                        <div className="text-xl sm:text-2xl font-bold">{stats.activeUsers}</div>
                        {/* <p className="text-xs text-(--color-foreground)/70">+{statChanges.usersChange} since last month</p> */}
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Recent Activity Chart */}
                <Card className="bg-(--color-background) border-[#2D3237]  text-(--color-foreground) lg:col-span-2">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <CardTitle>Sales Overview</CardTitle>
                        <div className="flex items-center text-xs  text-(--color-foreground)/70">
                            <TrendingUp className="h-4 w-4 mr-1 text-[#668389]" />
                            <span>+12.5% from last month</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center">
                            {/* This would be a chart in a real implementation */}
                            <div className="w-full h-full relative">
                                <div className="absolute bottom-0 left-0 w-full h-[100%] flex items-end">
                                    {weeklySaleData && weeklySaleData.map((entry, index) => {
                                        const maxHeight = 90;
                                        const maxCount = Math.max(...weeklySaleData.map(e => e.count)) || 1;
                                        const heightPercent = (entry.count / maxCount) * maxHeight;

                                        return (
                                            <div
                                                key={index}
                                                className="w-1/7 mx-1 bg-[#668389] rounded-t-sm"
                                                style={{ height: `${heightPercent}%` }}
                                                title={`${entry.day}: ${entry.count}`}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="absolute bottom-[-25px] left-0 w-full flex justify-between px-1 text-xs  text-[#668389]/70 font-bold">
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
                <Card classNa="bg-(--color-background-t) border-[#2D3237] text-(--color-foreground)">
                    <CardHeader>
                        <CardTitle className="text-(--color-foreground)">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-1">
                            {recentOrders && recentOrders.map((purchase, index) => (
                                <div key={index} className="flex items-start pb-4 last:pb-0 border-b border-[#2D3237] last:border-0">
                                    <div className="rounded-full bg-(--color-background-secondary) p-2 mr-3 sm:mr-4 flex-shrink-0">
                                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-[#668389]" />
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <p className="text-sm font-medium leading-none truncate text-(--color-foreground)">{purchase.games[0].title}</p>
                                        <p className="text-xs  text-(--color-foreground)/70 truncate">by {purchase.user.email}</p>
                                        <div className="flex items-center pt-1 justify-between">
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 text-(--color-foreground)/70 mr-1" />
                                                <span className="text-xs text-(--color-foreground)/70">{new Date(purchase.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <span className="text-xs font-medium text-(--color-foreground)/80">${purchase.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Games
            <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-[#EDEDED]">Recent Games</h2>
                    <Button
                        variant="ghost"
                        className="text-[#668389] hover:text-[#668389]/80 hover:bg-[#2D3237] text-sm px-2 sm:px-4"
                        onClick={() => navigateTo("/view-games")}
                    >
                        View all <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
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
                            <CardContent className="p-3 sm:p-4">
                                <h3 className="font-semibold mb-1 sm:mb-2 line-clamp-1 text-sm sm:text-base">{game.name}</h3>
                                <div className="text-xs sm:text-sm text-[#DDD9FE]/70 mb-3 sm:mb-4">${game.price}</div>
                                <Button
                                    className="w-full bg-[#668389]/80 hover:bg-[#668389] text-xs sm:text-sm py-1 h-auto sm:h-8"
                                    onClick={() => navigateTo(`/view-games?id=${game.id}`)}
                                >
                                    <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Edit
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div> */}

            {/* Quick Actions */}
            <div className="mt-6 sm:mt-8 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-(--color-foreground) mb-3 sm:mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Button
                        className="h-auto py-4 sm:py-6 bg-(--color-background) border border-[#2D3237] hover:bg-(--color-background)/50 text-(--color-foreground) flex flex-col items-center"
                        onClick={() => navigateTo("add-a-game")}
                    >
                        <Plus className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm">Add New Game</span>
                    </Button>
                    <Button
                        className="h-auto py-4 sm:py-6 bg-(--color-background) border border-[#2D3237] hover:bg-(--color-background)/50 text-(--color-foreground) flex flex-col items-center"
                        onClick={() => navigateTo("view-games")}
                    >
                        <Edit className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm">Manage Games</span>
                    </Button>
                    <Button
                        className="h-auto py-4 sm:py-6 bg-(--color-background) border border-[#2D3237] hover:bg-(--color-background)/50 text-(--color-foreground) flex flex-col items-center"
                        onClick={() => navigateTo("help")}
                    >
                        <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm">View Help</span>
                    </Button>
                </div>
            </div>


        </div>
    )
}
