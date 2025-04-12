import api from './index';

export const getUsersCount = async (month, year) => {
    try {
        let url = `users/count`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch  users failed:', error?.response?.data || error.message);
        throw error;
    }
}
