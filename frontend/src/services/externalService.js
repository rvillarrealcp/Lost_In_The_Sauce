import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const getAuthHeaders = (token) => ({
    headers: {Authorization: `Token ${token}`}
});

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