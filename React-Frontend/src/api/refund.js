import api from './index';

export const processGameRefund = async (orderId, gameId, keyToRefund) => {
  try {
    const response = await api.post('refund/process', {
      orderId,
      gameId,
      keyToRefund
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to process refund:', error?.response?.data || error.message);
    throw error;
  }
};

export const replaceGameKey = async (orderId, gameId, oldKey) => {
  try {
    const response = await api.post('refund/replace', {
      orderId,
      gameId,
      oldKey
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to replace game key:', error?.response?.data || error.message);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`order/details/${orderId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order details:', error?.response?.data || error.message);
    throw error;
  }
};