import React from 'react';



const ViewGames = ({ games }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">View Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game) => (
                    <div key={game.id} className="bg-gray-700 p-4 rounded-lg">
                        <img src={game.image} alt={game.title} className="w-full h-48 object-cover rounded" />
                        <h3 className="text-xl font-bold mt-2">{game.title}</h3>
                        <p className="text-gray-400">{game.description}</p>
                        <p className="text-white mt-2">${game.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewGames;