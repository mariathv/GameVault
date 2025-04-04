
import api from './index';


export const getUserInventory = async (userId) => {
    try {
        let success = false;

        while (!success) {

            let url = `inventory/${userId}`;
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
