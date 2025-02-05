import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddGame from './components/AddGame';
import ViewGames from './components/ViewGames';
import ViewPurchases from './components/ViewPurchases';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/add-game" element={<AddGame />} />
            <Route path="/view-games" element={<ViewGames />} />
            <Route path="/view-purchases" element={<ViewPurchases />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Game Vault Admin
        </Link>
        <div className="space-x-4">
          <Link to="/add-game" className="text-white hover:text-gray-400">
            Add Game
          </Link>
          <Link to="/view-games" className="text-white hover:text-gray-400">
            View Games
          </Link>
          <Link to="/view-purchases" className="text-white hover:text-gray-400">
            View Purchases
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Dashboard = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to Game Vault Admin</h1>
      <p className="text-gray-400">Manage your game store with ease.</p>
    </div>
  );
};

export default App;