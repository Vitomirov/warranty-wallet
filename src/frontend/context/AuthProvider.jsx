import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost';

const initialToken = localStorage.getItem('accessToken');
const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    headers: {
        Authorization: initialToken ? `Bearer ${initialToken}` : undefined,
    }
});

// Request interceptor (ONLY place to set Authorization header)
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('AuthProvider: Request - Authorization header set:', config.headers.Authorization);
        } else {
            console.log('AuthProvider: Request - No token found, Authorization header not set.');
        }
        return config;
    },
    (error) => {
        console.error('AuthProvider: Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('AuthProvider: 401 error, attempting to refresh token.');

            try {
                const response = await refreshToken();
                console.log('AuthProvider: Refresh token response:', response);
                if (response.data && response.data.accessToken) {
                    setToken(response.data.accessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                    console.log('AuthProvider: Token refreshed, retrying request.');
                    return instance(originalRequest);
                } else {
                    console.error('AuthProvider: Refresh token failed, logging out.');
                    logout();
                }
            } catch (refreshError) {
                console.error('AuthProvider: Refresh token error:', refreshError);
                logout();
            }
        }
        return Promise.reject(error);
    }
);

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            console.log('AuthProvider: Token set:', token);

            const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp * 1000;
            const refreshTime = tokenExpiration - Date.now() - 30000;
            console.log('AuthProvider: Token expires in:', (tokenExpiration - Date.now()) / 1000, 'seconds. Refreshing in:', refreshTime / 1000, 'seconds.');

            const timer = setTimeout(() => {
                refreshToken();
            }, refreshTime);

            return () => clearTimeout(timer);
        }
    }, [token]);

    const login = async (username, password) => {
        console.log('AuthProvider: Logging in with username:', username);
        try {
            const response = await instance.post('/api/login', { username, password });
            if (response.data && response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setToken(response.data.accessToken);
                setUser(response.data.user);
                console.log('AuthProvider: Login successful, token set:', response.data.accessToken);
                return response.data;
            } else {
                console.error('AuthProvider: Login failed, access token not found.');
                throw new Error('Access token not found in response');
            }
        } catch (error) {
            console.error('AuthProvider: Login error:', error.message || 'Unknown error');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/');
        console.log('AuthProvider: Logged out.');
    };

    const refreshToken = async () => {
        console.log('AuthProvider: Refreshing token...');
        try {
            const response = await instance.post('/api/refresh-token');
            console.log('AuthProvider: Refresh token response:', response);
            if (response.data && response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                setToken(response.data.accessToken);
                console.log('AuthProvider: New token set.');
                console.log('AuthProvider: New token:', response.data.accessToken);
                console.log('AuthProvider: Local token:', localStorage.getItem('accessToken'));
                return response.data;
            } else {
                console.error('AuthProvider: Refresh token failed, access token not found.');
                throw new Error('Access token not found in response');
            }
        } catch (error) {
            console.error('AuthProvider: Refresh token error:', error.message || 'Unknown error');
            logout();
            throw error;
        }
    };

    const updateUser = (newUserData) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...newUserData,
        }));

        localStorage.setItem('user', JSON.stringify({
            ...user,
            ...newUserData,
        }));
        console.log('AuthProvider: User data updated:', newUserData);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, refreshToken, setToken, user, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { instance };
export default AuthProvider;