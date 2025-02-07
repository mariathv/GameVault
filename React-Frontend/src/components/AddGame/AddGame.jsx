import React, { useState, useEffect } from 'react';
import ViewGames from '../GameList';
import "./AddGame.css"
import { fetchData } from '../../api/api-gamevault';


const AddGame = () => {

    const [gamesList, setGamesList] = useState([]);
    const [search, setSearch] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    const fetchGames = async () => {
        try {
            if (search) {
                const response = await fetchData(`games/search/name/?search_query=${search}`);

                const gameIds = response.queryResult.map(game => game.id).join(",");

                const responsemulti = await fetch(`http://localhost:3000/api/v1/games/get/multi?ids=${gameIds}`);
                const dataMulti = await responsemulti.json();
                setGamesList(dataMulti);
                console.log("fetched game data (response 2) ", dataMulti);
            }

        } catch (error) {
            console.log("Error fetching games", error);
        }

    };

    useEffect(() => {
        fetchGames();
    }, [])

    return (
        <>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
                <h2 className="text-2xl font-bold mb-4"> Add Game Through Search</h2>
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={fetchGames}    >
                    Search
                </button>
                {gamesList.length != 0 &&
                    <>
                        <h2 className="text-xl font-bold mb-4">Search Result for "{search}"</h2>
                        <ViewGames games={gamesList.queryResult} sliceCount={7} />

                    </>
                }
            </div>


            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Add a New Game - Manually</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Game Title"
                        onChange={(e) => setGame({ ...game, title: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <textarea
                        placeholder="Game Description"
                        onChange={(e) => setGame({ ...game, description: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        onChange={(e) => setGame({ ...game, price: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        onChange={(e) => setGame({ ...game, image: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-white text-white py-2 rounded hover:bg-gray-300 "
                    >
                        Add Game
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddGame;