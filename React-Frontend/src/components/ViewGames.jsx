function ViewGames() {
    const games = [
        { id: 1, title: "Cyberpunk 2077", price: 59.99, sales: 1000, revenue: 59990 },
        { id: 2, title: "Red Dead Redemption 2", price: 49.99, sales: 1500, revenue: 74985 },
        { id: 3, title: "The Legend of Zelda: Breath of the Wild", price: 59.99, sales: 2000, revenue: 119980 },
    ]

    return (
        <div className="mt-8">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Game Title</th>
                            <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Price</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Sales</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {games.map((game) => (
                            <tr key={game.id}>
                                <td className="w-1/3 text-left py-3 px-4">{game.title}</td>
                                <td className="w-1/3 text-left py-3 px-4">${game.price.toFixed(2)}</td>
                                <td className="text-left py-3 px-4">{game.sales}</td>
                                <td className="text-left py-3 px-4">${game.revenue.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewGames

