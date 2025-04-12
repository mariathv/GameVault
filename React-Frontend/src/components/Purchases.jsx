import { useEffect, useState } from "react";
import { getAllOrders } from "../api/order";
import { ArrowRight, Search, Calendar } from "lucide-react";

function Purchases() {
    const [purchases, setPurchases] = useState(null);
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
    const [loading, isLoading] = useState(true);

    const fetchData = async (email, date) => {
        isLoading(true);
        const fetched = await getAllOrders(email, date);
        setPurchases(fetched.orders);
        isLoading(false);
    };

    const filteredSearch = () => {
        isLoading(true);
        fetchData(email, date);
        isLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-(--color-background) from-gray-50 to-(--color-background) p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-(--color-background) rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <h1 className="text-2xl font-bold text-(--color-foreground) flex-1">
                                Recent Purchases
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-foreground)/80 h-5 w-5" />
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full sm:w-48 border-2 border-gray-200 rounded-lg text-(--color-foreground) focus:outline-none focus:border-(--color-accent-primary) transition-colors "
                                        placeholder="Search by user"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-foreground)/80 h-5 w-5" />
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full sm:w-48 border-2 border-gray-200 rounded-lg text-(--color-foreground) focus:outline-none focus:border-(--color-accent-primary) transition-colors"
                                        placeholder="Date (MM/DD/YY)"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="flex items-center justify-center gap-2 px-6 py-2 bg-(--color-accent-primary) text-white rounded-lg hover:bg-(--color-accent-primary)/75 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={filteredSearch}
                                >
                                    <span className="hidden sm:inline">Search</span>
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-(--color-background-secondary) ">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-(--color-foreground)/50 uppercase tracking-wider">Game</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-(--color-foreground)/50 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-(--color-foreground)/50 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-(--color-foreground)/50 uppercase tracking-wider">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-(--color-background) divide-y divide-(--color-light-ed)/20">
                                    {purchases && purchases.slice(0, 10).map((purchase, purchaseIndex) => (
                                        <>
                                            {purchase.games.map((game, index) => (
                                                <tr key={`${purchase.id}-${index}`}
                                                    className=" transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-(--color-foreground)/80">
                                                        {game.title}
                                                    </td>
                                                    {index === 0 && (
                                                        <>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-foreground)/50" rowSpan={purchase.games.length}>
                                                                {purchase.user.email}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-foreground)/50" rowSpan={purchase.games.length}>
                                                                {new Date(purchase.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-(--color-accent-primary)" rowSpan={purchase.games.length}>
                                                                ${purchase.totalAmount.toFixed(2)}
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                            {purchaseIndex < purchases.length - 1 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-2">
                                                        <div className="border-t border-(--color-light-ed)/60"></div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Purchases;