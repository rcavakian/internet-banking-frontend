import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import api from '../../services/api';
import './Extrato.css';

export default function Extrato() {
    const [operacoes, setOperacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user_token");
        navigate("/login")
    };
    // Dados mockados enquanto o backend não está pronto
    const mockOperacoes = [
        { id: 1, tipo: 'DEPOSITO', valor: 500.00, dataHora: '2025-08-04T10:00:00', descricao: 'Depósito inicial' },
        { id: 2, tipo: 'PAGAMENTO', valor: 75.50, dataHora: '2025-08-04T11:30:00', descricao: 'Conta de luz' },
        { id: 3, tipo: 'SAQUE', valor: 100.00, dataHora: '2025-08-04T15:00:00', descricao: 'Saque caixa eletrônico' }
    ];

    useEffect(() => {
        const fetchExtrato = async () => {
            try {
                // Quando o backend estiver pronto:
                // const response = await api.get('/operacoes/extrato');
                // setOperacoes(response.data);
                setOperacoes(mockOperacoes); // Usando dados mockados por enquanto
            } catch (error) {
                console.error("Erro ao buscar extrato:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExtrato();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                        <tr key={op.id} className={`op-type-${op.tipo.toLowerCase()}`}>
                                            <td>{new Date(op.dataHora).toLocaleDateString('pt-BR')}</td>
                                            <td>{op.tipo}</td>
                                            <td>{op.descricao}</td>
                                            <td className="valor">
                                                {op.tipo === 'DEPOSITO' ? `+ ${op.valor.toFixed(2)}` : `- ${op.valor.toFixed(2)}`}
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