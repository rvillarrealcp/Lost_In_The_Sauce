import axios from 'axios';
import { API_URL } from './api';


export const registerUser = async (username, email, password1, password2) => {
    const response = await axios.post(`${API_URL}auth/registration`, {
        username,
        email,
        password1,
        password2
    });
    return response.data
};

export const loginUser = async(username,password) => {
    const response = await axios.post(`${API_URL}auth/login/`, {
        username,
        password
    });
    return response.data
};

export const logoutUser = async(token) => {
    const response = await axios.post(`${API_URL}auth/logout/`, {}, {
        headers: { Authorization: `Token ${token}`}
    });
    return response.data;
};

export const getCurrentUser = async(token) => {
    const response = await axios.get(`${API_URL}auth/user/`, {
        headers: {Authorization: `Token ${token}`}
    });
    return response.data
}