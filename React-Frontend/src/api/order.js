
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

export const getGameSaleCount = async (month, year) => {
    try {
        let url = `order/getCount?month=${month}&year=${year}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch  order count failed:', error?.response?.data || error.message);
        throw error;
    }
}

export const getRecentOrders = async () => {
    try {
        let url = `order/getRecentOrders`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch  order recent failed:', error?.response?.data || error.message);
        throw error;
    }
}

export const getWeeklySale = async () => {
    try {
        let url = `order/getWeeklySale`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch  weekly sale failed:', error?.response?.data || error.message);
        throw error;
    }
}

export const getTotalRevenue = async (month, year) => {
    try {
        let url = `order/revenue?month=${month}&year=${year}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch  order revenues failed:', error?.response?.data || error.message);
        throw error;
    }
}




