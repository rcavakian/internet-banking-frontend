import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Erro na API:', error);
        
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api;