import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../OperationPage.css';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function Pagamento() {
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user_token");
        navigate("/login")
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(false); // Fecha o modal

        try {
            // await api.post('/operacoes/deposito', { valor });
            setSuccess(`Pagamento de ${descricao} no valor de R$ ${valor} realizado com sucesso!`);
            setValor('');
        } catch (err) {
            console.error(err.message);
            setError('Não foi possível realizar o pagamento. Tente novamente.');
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