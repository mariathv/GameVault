function Purchases() {
    const purchases = [
        { id: 1, game: "Cyberpunk 2077", customer: "john@example.com", date: "2024-02-08", price: 59.99 },
        { id: 2, game: "Red Dead Redemption 2", customer: "jane@example.com", date: "2024-02-07", price: 49.99 },
        {
            id: 3,
            game: "The Legend of Zelda: Breath of the Wild",
            customer: "mike@example.com",
            date: "2024-02-06",
            price: 59.99,
        },
    ]

    return (
        <div className="mt-8">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Game</th>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Customer</th>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Price</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {purchases.map((purchase) => (
                            <tr key={purchase.id}>
                                <td className="w-1/4 text-left py-3 px-4">{purchase.game}</td>
                                <td className="w-1/4 text-left py-3 px-4">{purchase.customer}</td>
                                <td className="w-1/4 text-left py-3 px-4">{purchase.date}</td>
                                <td className="w-1/4 text-left py-3 px-4">${purchase.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Purchases

