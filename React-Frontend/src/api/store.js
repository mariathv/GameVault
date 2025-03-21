import api from './index';

export const getGamesByGenre = async (id, limit) => {
    try {
        let url = `/store/games/get-all?genre=${id}`;
        if (limit) {
            url += `&limit=${limit}`;
        }

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch genre games failed:', error?.response?.data || error.message);
        throw error;
    }
};
