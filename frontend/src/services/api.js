// services/api.js – Axios instance with auth header injection
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('shanauto_user') || 'null');
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Global response error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('shanauto_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
