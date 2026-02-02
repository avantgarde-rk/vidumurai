import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global Error Handler for Demo Mode
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            const msg = error.response.data.message || 'Access Denied';
            // Alert user if it's a Demo Restriction
            if (msg.includes('Demo Mode')) {
                alert(`⚠️ DEMO MODE RESTRICTION \n\n${msg}`);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
