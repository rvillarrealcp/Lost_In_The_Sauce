import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/auth/';

export const registerUser = async (username, email, password1, password2) => {
    const response = await axios.post(`${API_URL}registration`, {
        username,
        email,
        password1,
        password2
    });
    return response.data
};

export const loginUser = async(username,password) => {
    const response = await axios.post(`${API_URL}login/`, {
        username,
        password
    });
    return response.data
};

export const logoutUser = async(token) => {
    const response = await axios.post(`${API_URL}logout/`, {}, {
        headers: { Authorization: `Token ${token}`}
    });
    return response.data;
};

export const getCurrentUser = async(token) => {
    const response = await axios.get(`${API_URL}user/`, {
        headers: {Authorization: `Token ${token}`}
    });
    return response.data
}