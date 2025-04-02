
import api from './index';

export const placeOrder = async (userId, games, paymentMethod) => {
    try {
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

export const getAllOrders = async (email = '', date = '') => {
    try {
        const queryParams = new URLSearchParams();

        if (email) {
            queryParams.append('email', email);
        }

        if (date) {
            queryParams.append('date', date);
        }
        let url = `order/get-all-orders?${queryParams.toString()}`;

        const response = await api.get(url);

        return response.data;
    } catch (error) {
        console.error('Failed to fetch all orders:', error?.response?.data || error.message);
        throw error;
    }
};




