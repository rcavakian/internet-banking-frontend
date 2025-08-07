import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserAccounts } from '../../hooks/useAuth';
import api from '../../services/api';
import './Extrato.css';

export default function Extrato() {
    const [operacoes, setOperacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { accounts, refetch } = useUserAccounts();

    const handleLogout = () => {
        logout();
        navigate("/login")
    };

    useEffect(() => {
        const fetchExtrato = async () => {
            try {
                if (accounts.length > 0) {
                    const accountId = accounts[0].id;
                    const response = await api.get(`/operations/statement?accountId=${accountId}`);
                    setOperacoes(response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar extrato:", error);
                setError("Erro ao carregar extrato. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        if (accounts.length > 0) {
            fetchExtrato();
        } else if (!loading) {
            setLoading(false);
        }
    }, [accounts]);

    const formatTipoOperacao = (tipo) => {
        const tipos = {
            'DEPOSIT': 'DEPÓSITO',
            'WITHDRAWAL': 'SAQUE', 
            'PAYMENT': 'PAGAMENTO'
        };
        return tipos[tipo] || tipo;
    };

    return (
        <div className="operation-page statement-page">
            <header className="dashboard-navbar">
                <h1 className="navbar-title" onClick={() => navigate('/dashboard')}>Banco Caramelo</h1>
                <div className="navbar-actions">
                    <button onClick={() => navigate('/dashboard')} className="back-button">Voltar</button>
                    <button onClick={handleLogout} className="logout-button-op">Sair</button>
                </div>
            </header>
            <main className="operation-content">
                <div className="operation-card">
                    <h2>Extrato da Conta</h2>
                    {/* Aqui virão os filtros de data e tipo */}
                    <div className="statement-list">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : operacoes.length === 0 ? (
                            <p>Nenhuma operação encontrada.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Tipo</th>
                                        <th>Descrição</th>
                                        <th>Valor (R$)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operacoes.map(op => (
                                        <tr key={op.id} className={`op-type-${op.operationType?.toLowerCase() || 'default'}`}>
                                            <td>{new Date(op.dateTime).toLocaleDateString('pt-BR')}</td>
                                            <td>{formatTipoOperacao(op.operationType)}</td>
                                            <td>{op.description || 'Sem descrição'}</td>
                                            <td className="valor">
                                                {op.operationType === 'DEPOSIT' ? `+ ${op.value?.toFixed(2)}` : `- ${op.value?.toFixed(2)}`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );

}