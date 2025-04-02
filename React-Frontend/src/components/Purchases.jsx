import { useEffect, useState } from "react";
import { getAllOrders } from "../api/order";
import { ArrowRight } from "lucide-react";

function Purchases() {
    const [purchases, setPurchases] = useState(null);
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");

    const fetchData = async (email, date) => {
        const fetched = await getAllOrders(email, date); // Pass filters as arguments
        setPurchases(fetched.orders);
        console.log(fetched.orders);
    };

    const filteredSearch = () => {
        fetchData(email, date); // Trigger filtered search with current input values
    };

    useEffect(() => {
        fetchData(); // Fetch initial data when the component mounts
    }, []);

    return (
        <div className="mt-8">
            <div className="overflow-x-auto">
                <div className="text-(--color-foreground) font-bold px-5 pb-5 text-xl flex gap-2">
                    <div className="flex flex-1 ">
                        Recent Purchases
                    </div>
                    <div>
                        <input
                            type="text"
                            className="text-sm pl-4 py-2 border-2 border-(--color-light-ed)/50 rounded-full text-[#DDD9FE] focus:outline-none hover:border-(--color-light-ed)/80 "
                            placeholder="User"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update email state
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            className="text-sm pl-4 py-2 border-2 border-(--color-light-ed)/50 rounded-full text-[#DDD9FE] focus:outline-none hover:border-(--color-light-ed)/80 "
                            placeholder="Date (MM/DD/YY)"
                            value={date}
                            onChange={(e) => setDate(e.target.value)} // Update date state
                        />
                    </div>
                    <button
                        className="flex items-center gap-1 px-4 py-2 bg-(--color-light-ed) text-(--color-background) rounded-full hover:bg-(--color-light-ed)/80 focus:outline-none"
                        onClick={filteredSearch} // Trigger search on button click
                    >
                        <ArrowRight />
                    </button>
                </div>
                <table className="min-w-full bg-white ">
                    <thead className="bg-gray-800 text-(--color-foreground)">
                        <tr>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Game</th>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Customer</th>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Price</th>
                        </tr>
                    </thead>
                    <tbody className="text-(--color-foreground) bg-(--color-background)">
                        {purchases && purchases.slice(0, 10).map((purchase, purchaseIndex) => (
                            <>
                                {purchase.games.map((game, index) => (
                                    <tr key={`${purchase.id}-${index}`}>
                                        <td className="w-1/4 text-left py-3 px-4">{game.title}</td>

                                        {/* Render these cells only for the first game in each purchase */}
                                        {index === 0 && (
                                            <>
                                                <td className="w-1/4 text-left py-3 px-4" rowSpan={purchase.games.length}>
                                                    {purchase.user.email}
                                                </td>
                                                <td className="w-1/4 text-left py-3 px-4" rowSpan={purchase.games.length}>
                                                    {new Date(purchase.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="w-1/4 text-left py-3 px-4" rowSpan={purchase.games.length}>
                                                    ${purchase.totalAmount.toFixed(2)}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}

                                {/* Separator Row */}
                                {purchaseIndex < purchases.length - 1 && (
                                    <tr>
                                        <td colSpan="4">
                                            <hr className="border-t border-gray-300 my-2" />
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Purchases;
