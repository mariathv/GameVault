import React, { useState } from 'react';

const AddGame = () => {
    const [game, setGame] = useState({
        title: '',
        description: '',
        price: '',
        image: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Game Added:', game);
        // Add logic to save the game to the database
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add a New Game</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Game Title"
                    value={game.title}
                    onChange={(e) => setGame({ ...game, title: e.target.value })}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                />
                <textarea
                    placeholder="Game Description"
                    value={game.description}
                    onChange={(e) => setGame({ ...game, description: e.target.value })}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={game.price}
                    onChange={(e) => setGame({ ...game, price: e.target.value })}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={game.image}
                    onChange={(e) => setGame({ ...game, image: e.target.value })}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-white text-black py-2 rounded hover:bg-gray-300"
                >
                    Add Game
                </button>
            </form>
        </div>
    );
};

export default AddGame;