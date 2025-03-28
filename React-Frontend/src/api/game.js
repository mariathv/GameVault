import api from './index';

export const getGameArtworks = async (artworks) => {
    try {
        let url = `games/get/artworks?ids=${artworks}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('fetch artwork games failed:', error?.response?.data || error.message);
        throw error;
    }
};
