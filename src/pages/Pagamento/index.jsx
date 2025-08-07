import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserAccounts } from '../../hooks/useAuth';
import api from '../../services/api';
import '../OperationPage.css';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function Pagamento() {
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

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (parseFloat(valor) <= 0 || !valor) {
            setError('Por favor, insira um valor válido.');
            return;
        }
        if (!descricao.trim()) {
            setError("Por favor, preencha a descrição do pagamento");
            return;
        }
        setIsModalOpen(true);
        // falta implementar o restante da logica
    };

    const handleConfirmPagamento = async () => {
        setIsModalOpen(false);

        try {
            if (accounts.length === 0) {
                setError('Nenhuma conta encontrada para o usuário.');
                return;
            }

            const accountId = accounts[0].id;
            const response = await api.post('/operations/payment', { 
                accountId: accountId,
                value: parseFloat(valor),
                description: descricao
            });

            console.log('Pagamento realizado:', response.data);
            setSuccess(`Pagamento de ${descricao} no valor de R$ ${valor} realizado com sucesso!`);
            setValor('');
            setDescricao('');
            
            // Atualizar os dados da conta após um pequeno delay
            setTimeout(async () => {
                await refetch();
            }, 1000);
        } catch (err) {
            console.error('Erro no pagamento:', err);
            if (err.response) {
                setError(err.response.data.message || 'Erro no servidor. Tente novamente.');
            } else {
                setError('Não foi possível realizar o pagamento. Verifique sua conexão.');
            }
        }
    };

    return (
        <div className="operation-page">
            <header className="dashboard-navbar">
                <h1 className="navbar-title" onClick={() => navigate('/dashboard')}>Banco Caramelo</h1>
                <div className="navbar-actions">
                    <button onClick={() => navigate('/dashboard')} className="back-button">Voltar</button>
                    <button onClick={handleLogout} className="logout-button-op">Sair</button>
                </div>
            </header>
            <main className="operation-content">
                <div className="operation-card">
                    <h2>Pagamento</h2>
                    <p>Informe os detalhes do pagamento a ser realizado.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="valor">Valor do Pagamento</label>
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
                            <label htmlFor="descricao">Descrição</label>
                            <textarea
                                id="descricao"
                                placeholder="Ex: Conta de energia, Mensalidade..."
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <button type="submit" className="operation-button">Confirmar Pagamento</button>
                    </form>
                </div>
            </main>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmPagamento}
                title="Confirmar Pagamento"
            >
                <p>Confirma o pagamento de <strong>{descricao}</strong> no valor de <strong>R$ {parseFloat(valor || 0).toFixed(2)}</strong>?</p>
            </ConfirmationModal>
        </div>
    );
}