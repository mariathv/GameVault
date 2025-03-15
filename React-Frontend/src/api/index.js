import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

let latestToken = null;

export const setGlobalAuthToken = (token) => {
    latestToken = token;
    localStorage.setItem("gamevault_token", token);
};

api.interceptors.request.use(
    async (config) => {
        const tokenToUse = latestToken || localStorage.getItem("gamevault_token");
        if (tokenToUse) {
            config.headers.Authorization = `Bearer ${tokenToUse}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API error:", error?.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
