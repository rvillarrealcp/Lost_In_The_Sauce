import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/'

const getAuthHeaders = (token) => ({
    headers:{ Authorization: `Token ${token}`}
});

export const getRecipes = async (token) => {
    const response = await axios.get(`${API_URL}recipes/`, getAuthHeaders(token));
    return response.data
};

export const getRecipe = async (token, id) => {
    const response = await axios.get(`${API_URL}recipes/${id}/`, getAuthHeaders(token))
    return response.data
};

export const createRecipe = async (token, recipeData) => {
    const response = await axios.post(`${API_URL}recipes/`, recipeData, getAuthHeaders(token));
    return response.data
};

export const updateRecipe = async (token, id, recipeData) => {
    const response = await axios.put(`${API_URL}recipes/${id}/`, recipeData, getAuthHeaders(token));
    return response.data
};

export const deleteRecipe = async (token, id) => {
    const response = await axios.delete(`${API_URL}recipes/${id}/`, getAuthHeaders(token));
    return response.data
}