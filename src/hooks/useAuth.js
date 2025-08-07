import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            const token = localStorage.getItem('token');
            
            if (token) {
                try {
                    // Buscar dados completos do usuário do backend
                    const response = await api.get('/users/me');
                    setUser(response.data);
                    // Atualizar localStorage com dados completos
                    localStorage.setItem('user', JSON.stringify(response.data));
                } catch (error) {
                    console.error('Erro ao carregar dados do usuário:', error);
                    // Se falhar, usar dados do localStorage como fallback
                    const userData = localStorage.getItem('user');
                    if (userData) {
                        setUser(JSON.parse(userData));
                    }
                }
            }
            setLoading(false);
        };

        loadUserData();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return { user, loading, logout };
};

export const useUserAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            console.log('Buscando contas do usuário...');
            const response = await api.get('/accounts');
            console.log('Contas recebidas:', response.data);
            setAccounts(response.data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar contas');
            console.error('Erro ao buscar contas:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return { accounts, loading, error, refetch: fetchAccounts };
};
