import axios from 'axios';
import { API_URL, getAuthHeaders } from './api';

export const getPantryItems = async (token) => {
    const response = await axios.get(`${API_URL}pantry/`, getAuthHeaders(token));
    return response.data;
};

export const getPantryItem = async (token) => {
    const response = await axios.get(`${API_URL}pantry/${id}/`, getAuthHeaders(token));
    return response.data;
}

export const createPantryItem = async (token, itemData) => {
    const response = await axios.post(`${API_URL}pantry/`, itemData, getAuthHeaders(token));
    return response.data;
}

export const updatePantryItem = async (token, id, itemData) => { 
    const response = await axios.put (`${API_URL}pantry/${id}/`, itemData, getAuthHeaders(token));
    return response.data;
}

export const deletePantryItem = async (token, id) => {
    const response = await axios.delete(`${API_URL}pantry/${id}/`, getAuthHeaders(token));
    return response.data;
}
