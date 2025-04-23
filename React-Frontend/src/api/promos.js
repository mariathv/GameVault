import api from './index';

export const createNewPromoCode = async (body) => {
    try {
        let url = `promo/create/`;
        console.log(body);
        const response = await api.post(url, body);


        return response.data;
    } catch (error) {
        console.error('create new promo code failed:', error?.response?.data || error.message);
        throw error;
    }
};

export const getPromoCodes = async () => {
    try {
        let url = `promo/`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('get promo codes failed:', error?.response?.data || error.message);
        throw error;
    }
}

export const deletePromoCode = async (id) => {
    try {
        let url = `promo/${id}`;
        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        console.error('delete promo codes failed:', error?.response?.data || error.message);
        throw error;
    }
}

export const applyPromoCode = async (code, orderTotal) => {
    try {
        let url = `promo/apply`;
        const response = await api.post(url, { code, orderTotal });
        return response.data;
    } catch (err) {
        console.error('apply promo code failed:', err?.response?.data || err.message);
        return err.response.data;
    }
}