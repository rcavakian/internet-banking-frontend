import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserAccounts } from '../../hooks/useAuth';
import api from '../../services/api';
import '../OperationPage.css';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function Saque() {
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { accounts, refetch } = useUserAccounts();

    const handleLogout = () => {
        logout();
        navigate("/login")
    };


    const handleSaque = async (event) => {
        // falta implementar a logica de saque
        event.preventDefault();
        setError('');
        setSuccess('');

        if (parseFloat(valor) <= 0 || !valor) {
            setError("Por favor, insira um valor válido para saque.");
            return;
        }

        setIsModalOpen(true);
    }

    const handleConfirmSaque = async () => {
        setIsModalOpen(false);

        try {
            if (accounts.length === 0) {
                setError('Nenhuma conta encontrada para o usuário.');
                return;
            }

            const accountId = accounts[0].id;
            const response = await api.post('/operations/withdrawal', { 
                accountId: accountId,
                value: parseFloat(valor),
                description: descricao || null
            });

            console.log('Saque realizado:', response.data);
            setSuccess(`Saque de R$ ${valor} realizado com sucesso!`);
            setValor('');
            setDescricao('');
            
            // Atualizar os dados da conta após um pequeno delay
            setTimeout(async () => {
                await refetch();
            }, 1000);
        } catch (err) {
            console.error('Erro no saque:', err);
            if (err.response) {
                setError(err.response.data.message || 'Erro no servidor. Tente novamente.');
            } else {
                setError('Não foi possível realizar o saque. Verifique sua conexão.');
            }
        }
    };

    return (
        <div className="operation-page">
            <header className="dashboard-navbar">
                <h1 className="navbar-title" onClick={() => navigate('/dashboard')}>Banco Caramelo</h1>
                {/* NOVO: Grupo de botões */}
                <div className="navbar-actions">
                    <button onClick={() => navigate('/dashboard')} className="back-button">Voltar</button>
                    <button onClick={handleLogout} className="logout-button-op">Sair</button>
                </div>
            </header>
            <main className="operation-content">
                <div className="operation-card">
                    <h2>Saque</h2>
                    <p>Informe o valor que deseja sacar da sua conta.</p>
                    <form onSubmit={handleSaque}>
                        <div className="input-group">
                            <label htmlFor="valor">Valor do Saque</label>
                            <input
                                type="number"
                                step="0.01"
                                id="valor"
                                placeholder="R$ 0,00"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="descricao">Descrição (opcional)</label>
                            <input
                                type="text"
                                id="descricao"
                                placeholder="Ex: Saque emergencial, Retirada..."
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <button type="submit" className="operation-button">Confirmar Saque</button>
                    </form>
                </div>
            </main>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSaque}
                title="Confirmar Saque"
            >
                <p>Confirma o saque no valor de <strong>R$ {parseFloat(valor || 0).toFixed(2)}</strong>?</p>
                {descricao && <p><strong>Descrição:</strong> {descricao}</p>}
            </ConfirmationModal>
        </div>
    );
}