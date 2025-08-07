import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserAccounts } from '../../hooks/useAuth';
import api from '../../services/api';
import '../OperationPage.css';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function Deposito() {
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

    const handleDeposito = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (parseFloat(valor) <= 0 || !valor) {
            setError("Por favor, insira um valor válido para depósito.");
            return;
        }

        setIsModalOpen(true);

        // try {
        //     // await api.post('/operacoes/deposito', { valor });
        //     setSuccess(`Depósito de R$ ${valor} realizado com sucesso!`);
        //     // Limpa o campo após o sucesso
        //     setValor('');
        // } catch (err) {
        //     console.error(err.message);
        //     setError("Não foi possível realizar o depósito. Tente novamente.");
        // }
    };

    const handleConfirmDeposito = async () => {
        setIsModalOpen(false);

        try {
            if (accounts.length === 0) {
                setError('Nenhuma conta encontrada para o usuário.');
                return;
            }

            const accountId = accounts[0].id;
            const response = await api.post('/operations/deposit', { 
                accountId: accountId,
                value: parseFloat(valor),
                description: descricao || null
            });

            console.log('Depósito realizado:', response.data);
            setSuccess(`Depósito de R$ ${valor} realizado com sucesso!`);
            setValor('');
            setDescricao('');
            
            // Atualizar os dados da conta após um pequeno delay
            setTimeout(async () => {
                await refetch();
            }, 1000);
        } catch (err) {
            console.error('Erro no depósito:', err);
            if (err.response) {
                setError(err.response.data.message || 'Erro no servidor. Tente novamente.');
            } else {
                setError('Não foi possível realizar o depósito. Verifique sua conexão.');
            }
        }
    };
    return (
        <div className="operation-page">
            {/* Podemos reutilizar o navbar do dashboard ou criar um componente para ele */}
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
                    <h2>Depósito</h2>
                    <p>Informe o valor que você deseja depositar na sua conta.</p>
                    <form onSubmit={handleDeposito}>
                        <div className="input-group">
                            <label htmlFor="valor">Valor do Depósito</label>
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
                                placeholder="Ex: Depósito inicial, Transferência..."
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <button type="submit" className="operation-button">Confirmar Depósito</button>
                    </form>
                </div>
            </main>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDeposito}
                title="Confirmar Depósito"
            >
                <p>Confirma o depósito no valor de <strong>R$ {parseFloat(valor || 0).toFixed(2)}</strong>?</p>
                {descricao && <p><strong>Descrição:</strong> {descricao}</p>}
            </ConfirmationModal>
        </div>
    );
}