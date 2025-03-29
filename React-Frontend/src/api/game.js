import api from './index';

export const getGameArtworks = async (artworks) => {
    try {
        let url = `games/get/artworks?ids=${artworks}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch artworks failed:', error?.response?.data || error.message);
        throw error;
    }
};

export const getGameThemes = async (themes) => {
    try {
        let url = `games/get/themes?ids=${themes}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch themes failed:', error?.response?.data || error.message);
        throw error;
    }
};
