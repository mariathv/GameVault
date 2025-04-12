import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/src/contexts/auth-context';
import { Star, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getUserInventory } from '@/src/api/inventory';
import GameDetailModal from '@/src/components/GameDetailModal';


const Inventory = () => {
  const { user, authToken } = useAuth();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const fetch = await getUserInventory(user._id);
        console.log(fetch);
        setInventoryItems(fetch.inventory);
      } catch (err) {
        console.error('Inventory fetch error:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authToken]);

  const openModal = (game, order) => {
    setSelectedGame({ ...game, order });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedGame(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Modal component

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center h-[60vh]">
      <div className="loader-dots text-(--color-light-ed)"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen container mx-auto p-4">
      <div className="bg-(--color-secondary-background)/10 p-6 rounded-xl text-center text-(--color-foreground)">
        <h2 className="text-xl font-bold mb-2">Error Loading Inventory</h2>
        <p className="text-(--color-foreground)/80 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-(--color-secondary-background) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90"
        >
          Retry
        </Button>
      </div>
    </div>
  );

  if (!user) return (
    <div className="container mx-auto p-4">
      <div className="bg-(--color-secondary-background)/10 p-6 rounded-xl text-center text-(--color-foreground)">
        <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
        <p className="text-(--color-foreground)/80">Please log in to view your inventory.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-(--color-background)">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-(--color-foreground)">My Inventory</h1>
          <Badge className="ml-4 bg-(--color-secondary-background) text-(--color-alt-foreground)">
            {inventoryItems && inventoryItems.reduce((total, order) => total + (order.games?.length || 0), 0)} Games
          </Badge>
        </div>

        {inventoryItems && inventoryItems.length === 0 ? (
          <div className="bg-(--color-secondary-background)/10 p-8 rounded-xl text-center">
            <h3 className="text-xl font-medium text-(--color-foreground) mb-2">Your library is empty</h3>
            <p className="text-(--color-foreground)/80 mb-4">
              Explore the store to discover and purchase new games for your collection.
            </p>
            <Button className="bg-(--color-secondary-background) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90">
              Browse Store
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {inventoryItems && inventoryItems.map((order) => (
              <Card key={order.orderId || order._id} className="bg-(--color-secondary-background)/5 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-(--color-foreground)/10">
                    <div>
                      <h3 className="font-medium text-(--color-foreground)">
                        Order #{order.transactionId?.slice(-6) || 'N/A'}
                      </h3>
                      <p className="text-sm text-(--color-foreground)/60">
                        {formatDate(order.purchaseDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-(--color-foreground)/60">Order Total</p>
                      <p className="font-semibold text-lg text-(--color-foreground)">
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>

                  {order.games?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.games.map((game) => (
                        <div
                          key={game.gameId}
                          onClick={() => openModal(game, order)}
                          className="bg-(--color-background) hover:bg-(--color-foreground)/5 transition-colors rounded-lg overflow-hidden cursor-pointer flex border border-(--color-foreground)/10"
                        >
                          <div className="w-1/3 relative">
                            <img
                              src={game.cover_url?.startsWith('//')
                                ? `https:${game.cover_url}`
                                : game.cover_url || '/placeholder-game.png'
                              }
                              alt={game.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder-game.png';
                              }}
                            />
                            {game.quantity > 1 && (
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {game.quantity}
                              </div>
                            )}
                          </div>
                          <div className="w-2/3 p-3">
                            <h4 className="font-medium mb-1 text-(--color-foreground) line-clamp-1">{game.title || 'Unknown Game'}</h4>
                            <div className="flex items-center text-sm">
                              <span className="text-(--color-foreground)/60">${game.price?.toFixed(2) || '0.00'}</span>
                              {game.gameKeys?.length > 0 && (
                                <Badge className="ml-2 bg-(--color-accent-primary) text-xs text-white">
                                  {game.gameKeys.length} {game.gameKeys.length === 1 ? 'Key' : 'Keys'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-(--color-foreground)/60 py-4">No games in this order</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {modalOpen && <GameDetailModal selectedGame={selectedGame} closeModal={closeModal} />}
    </div>
  );
};

export default Inventory;