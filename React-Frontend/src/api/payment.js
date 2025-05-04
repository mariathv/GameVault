import api from './index';

export const createCustomer = async (customerData) => {
    try {
        const response = await api.post('payments/customers', customerData);
        return response.data;
    } catch (error) {
        console.error('Failed to create customer:', error?.response?.data || error.message);
        throw error;
    }
};

export const getCustomer = async (customerId) => {
    try {
        const response = await api.get(`payments/customers/${customerId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to get customer:', error?.response?.data || error.message);
        throw error;
    }
};

export const saveCard = async (cardData) => {
    try {
        const response = await api.post('payments/cards', cardData);
        return response.data;
    } catch (error) {
        console.error('Failed to save card:', error?.response?.data || error.message);
        throw error;
    }
};

export const getCustomerCards = async (customerId) => {
    try {
        const response = await api.get(`payments/customers/${customerId}/cards`);
        return response.data;
    } catch (error) {
        console.error('Failed to get customer cards:', error?.response?.data || error.message);
        throw error;
    }
};

export const deleteCard = async (cardId) => {
    try {
        const response = await api.delete(`payments/cards/${cardId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete card:', error?.response?.data || error.message);
        throw error;
    }
};

export const processPayment = async (paymentData) => {
    try {
        const response = await api.post('payments/process', paymentData);
        return response.data;
    } catch (error) {
        console.error('Failed to process payment:', error?.response?.data || error.message);
        throw error;
    }
};

export const getPayment = async (paymentId) => {
    try {
        const response = await api.get(`payments/payments/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to get payment details:', error?.response?.data || error.message);
        throw error;
    }
};

export const purchaseGames = async (orderData) => {
    try {
        // This combines the game purchase with payment processing
        const { userId, games, sourceId, customerId, amount, currency = 'USD' } = orderData;
        
        const paymentData = {
            sourceId,
            customerId,
            amount,
            currency,
            games,
            userId
        };
        
        const response = await processPayment(paymentData);
        return response;
    } catch (error) {
        console.error('Failed to purchase games:', error?.response?.data || error.message);
        throw error;
    }
};