const Order = require('../models/order');
const StoreGames = require('../models/store');
const User = require('../models/users');
const mailController = require('./mail.controller');

const refundController = {
    processRefund: async (req, res) => {
        try {
            const { orderId, gameId, keyToRefund } = req.body;
    
            const order = await Order.findById(orderId).populate('user');
            if (!order) {
                console.log(`Refund Error: Order with ID ${orderId} not found.`);
                throw new Error("Order not found");
            }
    
            const gameInOrder = order.games.find(g => g.gameId.toString() === gameId);
            if (!gameInOrder) {
                console.log(`Refund Error: Game with ID ${gameId} not found in order ${orderId}.`);
                throw new Error("Game not found in order");
            }
    
            const keyIndex = gameInOrder.gameKeys.indexOf(keyToRefund);
            if (keyIndex === -1) {
                console.log(`Refund Error: Key ${keyToRefund} not found in order ${orderId} for game ${gameId}.`);
                throw new Error("Game key not found in order");
            }
    
            gameInOrder.gameKeys.splice(keyIndex, 1);
            gameInOrder.quantity -= 1;
    
            const refundAmount = gameInOrder.price;
            order.totalAmount -= refundAmount + (refundAmount * 0.08); 
    
            await order.save();
    
            const gameInStore = await StoreGames.findById(gameId);
            if (!gameInStore) {
                console.log(`Refund Error: Store game with ID ${gameId} not found.`);
                throw new Error("Store game not found");
            }
    
            gameInStore.gameKeys.push(keyToRefund);
            gameInStore.copies += 1;
            await gameInStore.save();
    
            await order.user.addToWallet(refundAmount); 
    
            if (order.user && order.user.email) {
                await mailController.sendRefundConfirmation(
                    order.user.email,
                    gameInOrder.title,
                    keyToRefund,
                    refundAmount
                );
            }
    
            res.status(200).json({ message: "Game key refunded successfully", order });
        } catch (error) {
            console.log(`Refund Error: ${error.message}`);
            res.status(500).json({ message: "Error refunding game key", error: error.message });
        }
    },
    
    
    replaceGameKey: async (req, res) => {
        try {
            const { orderId, gameId, oldKey } = req.body;
    
            const order = await Order.findById(orderId).populate('user');
            if (!order) throw new Error("Order not found");
    
            const gameInOrder = order.games.find(g => g.gameId.toString() === gameId);
            if (!gameInOrder) throw new Error("Game not found in order");
    
            const keyIndex = gameInOrder.gameKeys.indexOf(oldKey);
            if (keyIndex === -1) throw new Error("Old game key not found in order");
    
            const gameInStore = await StoreGames.findById(gameId);
            if (!gameInStore) throw new Error("Store game not found");
    
            const newKey = gameInStore.gameKeys.pop();
            if (!newKey) throw new Error("No replacement keys available");
    
            gameInOrder.gameKeys[keyIndex] = newKey;
    
            await order.save();
            await gameInStore.save();
    
            if (order.user && order.user.email) {
                await mailController.sendReplacementKey(
                    order.user.email,
                    gameInOrder.title,
                    oldKey,
                    newKey
                );
            }
    
            res.status(200).json({ message: "Game key replaced successfully", newKey });
        } catch (error) {
            res.status(500).json({ message: "Error replacing game key", error: error.message });
        }
    }
    
};

module.exports = refundController;
