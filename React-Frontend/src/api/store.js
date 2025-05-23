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

export const getMostPopular = async (limit) => {
    try {
        let url = `store/games/get-all/?sortBy=hypes`;
        if (limit) {
            url += `&limit=${limit}`;
        }

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch popular games failed:', error?.response?.data || error.message);
        throw error;
    }
}

export const getFeatured = async () => {
    try {
        let url = `store/get-featured/`;


        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch featured game failed:', error?.response?.data || error.message);
        throw error;
    }
}

export const setGameDiscount = async (gameId, discount) => {
    try {
        console.log("sicsjiad", discount);
        let url = `store/set-discount/`;

        const response = await api.post(url, {
            gameId,
            discount,
        });

        return response.data;
    } catch (error) {
        console.error('Failed to set game discount:', error?.response?.data || error.message);
        throw error;
    }
};

export const getGameCount = async () => {
    try {
        let url = `store/gameCount/`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch  game count failed:', error?.response?.data || error.message);
        throw error;
    }
}


