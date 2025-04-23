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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function retryRequest(error) {
    let retries = error.config.__retryCount || 0;
    if (retries >= MAX_RETRIES) return Promise.reject(error);

    retries += 1;
    error.config.__retryCount = retries;

    const delay = RETRY_DELAY * Math.pow(2, retries - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return api(error.config);
}

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
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 429 && message === "Too Many Requests") {
            return retryRequest(error);
        }

        console.error("API error:", error?.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;