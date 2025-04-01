
import api from './index';

export const placeOrder = async (userId, games, paymentMethod) => {
    try {
        console.log("Placing order for user:", userId);
        let url = `order/create-order/`;

        const response = await api.post(url, {
            userId,
            games,
            paymentMethod,
        });

        return response.data;
    } catch (error) {
        console.error('Failed to place order:', error?.response?.data || error.message);
        throw error;
    }
};
