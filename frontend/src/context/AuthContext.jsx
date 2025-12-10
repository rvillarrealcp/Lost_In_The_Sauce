import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token){
                try{
                    const userData = await getCurrentUser(token);
                    setUser(userData);
                } catch(error){
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('token');
                    setToken(null)
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value = {{ user, token, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};