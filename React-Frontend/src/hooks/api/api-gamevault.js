const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import api from '../../api/index'

export const fetchData = async (endpoint) => {
    try {
        const data = await fetch(`${API_BASE_URL}/${endpoint}`, {
            timeout: 20000,
        });
        if (!data.ok) {
            throw new Error(`HTTP error! Status: ${data.status}`);
        }
        const Json = await data.json();
        return Json;
    } catch (error) { }

};

export const apiRequest = async (endpoint, bodyData = {}, method = 'POST', customHeaders = {}) => {
    try {
        const config = {
            method,
            url: endpoint,
            headers: {
                'Content-Type': 'application/json',
                ...customHeaders,
            },
        };

        if (method.toUpperCase() === 'GET') {
            config.params = bodyData; // For GET, use query params
        } else {
            config.data = bodyData; // For POST, PUT, etc, use body
        }

        const response = await api(config);
        return response.data;
    } catch (error) {
        console.error('API Request Error:', error?.response?.data || error.message);
        throw error; // Let caller handle errors
    }
};

