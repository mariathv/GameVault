import React from 'react';

const purchases = [
    {
        id: 1,
        game: 'Cyberpunk 2077',
        buyer: 'John Doe',
        price: 49.99,
        date: '2023-10-01',
    },
    {
        id: 2,
        game: 'The Witcher 3: Wild Hunt',
        buyer: 'Jane Smith',
        price: 39.99,
        date: '2023-10-02',
    },
];

const ViewPurchases = () => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">View Purchases</h2>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-600">
                        <th className="p-2">Game</th>
                        <th className="p-2">Buyer</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((purchase) => (
                        <tr key={purchase.id} className="border-b border-gray-600">
                            <td className="p-2">{purchase.game}</td>
                            <td className="p-2">{purchase.buyer}</td>
                            <td className="p-2">${purchase.price}</td>
                            <td className="p-2">{purchase.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewPurchases;