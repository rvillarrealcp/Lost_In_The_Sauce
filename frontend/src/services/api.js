import axios from 'axios';

export const API_URL = 'http://127.0.0.1:8000/api/';

export const getAuthHeaders = (token) => ({
    headers: { Authorization: `Token ${token}` }
});

export const createApiClient = (token) => {
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};