import axios from 'axios';
import { API_URL, getAuthHeaders } from './api';

export const findRecipesByIngredients = async (token, ingredients) => {
    const response = await axios.post(
        `${API_URL}external/find-recipes/`,
        { ingredients },
        getAuthHeaders(token)
    );
    return response.data;
};

export const getRecipeDetails = async (token, recipeID) => {
    const response = await axios.get(
        `${API_URL}external/recipe/${recipeID}/`,
        getAuthHeaders(token)
    );
    return response.data
}

export const searchClassicRecipes = async (token,query) => {
    const response = await axios.get(
        `${API_URL}external/search-classic/?q=${encodeURIComponent(query)}`,
        getAuthHeaders(token)
    );
    return response.data
}