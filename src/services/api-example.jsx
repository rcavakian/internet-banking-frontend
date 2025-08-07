import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8082" // Usando o Gateway
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("user_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para lidar com respostas de erro (token expirado, etc.)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token inválido ou expirado
            localStorage.removeItem("user_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
