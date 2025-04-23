import api from './index';

export const getGameArtworks = async (artworks) => {
    try {
        let success = false;
        while (!success) {

            let url = `games/get/artworks?ids=${artworks}`;
            let response = await api.get(url);
            if (response.data) {
                success = true;
                return response.data;
            }
        }
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
