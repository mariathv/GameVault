import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

function GameDetailModal({ selectedGame, closeModal }) {
    if (!selectedGame) return null;

    const [artworks, setArtworks] = useState(null);


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const fetchGameArtworks = async (artworks) => {
        let fetch = await fetchData(`games/get/artworks?ids=${artworks}`);
        setArtworks(fetch.queryResult);
        console.log(fetch.queryResult);
    };

    useEffect(() => {
        fetchGameArtworks();
    }, [])


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-(--color-background) rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="relative">
                    <div className="h-36 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl overflow-hidden">
                        <img
                            src={selectedGame.cover_url?.startsWith('//')
                                ? `https:${selectedGame.cover_url}`
                                : selectedGame.cover_url || '/placeholder-game.png'
                            }
                            alt={selectedGame.title}
                            className="w-full h-full object-cover opacity-50"
                        />
                    </div>
                    <Button
                        onClick={closeModal}
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 ml-6">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border-4 border-(--color-background) shadow-lg">
                            <img
                                src={selectedGame.cover_url?.startsWith('//')
                                    ? `https:${selectedGame.cover_url}`
                                    : selectedGame.cover_url || '/placeholder-game.png'
                                }
                                alt={selectedGame.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/placeholder-game.png';
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-12 px-6 pb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-(--color-foreground)">{selectedGame.title || 'Unknown Game'}</h2>
                            <p className="text-sm text-(--color-foreground)/60">
                                Purchased on {formatDate(selectedGame.order.purchaseDate)}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-(--color-foreground)">${selectedGame.price?.toFixed(2) || '0.00'}</div>
                            {selectedGame.quantity > 1 &&
                                <Badge className="bg-(--color-accent-primary)">{selectedGame.quantity} Copies</Badge>
                            }
                        </div>
                    </div>

                    <div className="py-4 border-t border-(--color-foreground)/10">
                        <h3 className="text-lg font-semibold mb-2 text-(--color-foreground)">Purchase Details</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-(--color-foreground)/60">Order ID:</div>
                            <div className="text-(--color-foreground) font-medium">#{selectedGame.order.transactionId?.slice(-6) || 'N/A'}</div>

                            <div className="text-(--color-foreground)/60">Total Amount:</div>
                            <div className="text-(--color-foreground) font-medium">${selectedGame.order.totalAmount?.toFixed(2) || '0.00'}</div>
                        </div>
                    </div>

                    {selectedGame.gameKeys?.length > 0 && (
                        <div className="py-4 border-t border-(--color-foreground)/10">
                            <h3 className="text-lg font-semibold mb-2 text-(--color-foreground)">Game Keys</h3>
                            <div className="space-y-2">
                                {selectedGame.gameKeys.map((key, i) => (
                                    <div key={i} className="bg-(--color-secondary-background)/10 p-3 rounded-lg font-mono text-sm text-(--color-foreground) break-all">
                                        {key}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <Button onClick={closeModal} className="bg-(--color-secondary-background) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90">
                            Close
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default GameDetailModal