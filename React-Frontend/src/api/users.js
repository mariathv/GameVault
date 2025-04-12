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
export const verifyEmail = async (token) => {
    try {
        let url = `auth/verify-email/${token}`;
        console.log("gonna verify", url);

        const response = await api.get(url);
        console.log("verifyEmail response:", response);

        // Return any 2xx status as success
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error(response?.data?.message || "Unexpected response status");
        }
    } catch (error) {
        // Log more details about the error
        console.error('email verification failed:', error);
        console.error('Response data:', error?.response?.data);
        console.error('Status code:', error?.response?.status);
        throw error;
    }
};


