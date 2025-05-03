
import api from './index';


export const getUserInventory = async (userId) => {
    try {
        let success = false;

        while (!success) {

            let url = `inventory/${userId}`;
            let response = await api.get(url);
            if (response.data) {
                success = true;
                console.log(response.data)
                return response.data;
            }
        }
    } catch (error) {
        console.error('fetch user inventory failed:', error?.response?.data || error.message);
        throw error;
    }
};
