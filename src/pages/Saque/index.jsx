import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import api from '../../services/api';
import '../OperationPage.css';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function Saque() {
    const [valor, setValor] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user_token");
        navigate("/login")
    };

    const [isModalOpen, setIsModalOpen] = useState(false);


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
        setIsModalOpen(false); // Fecha o modal

        try {
            // await api.post('/operacoes/deposito', { valor });
            setSuccess(`Saque de R$ ${valor} realizado com sucesso!`);
            setValor('');
        } catch (err) {
            console.error(err.message);
            setError('Não foi possível realizar o saque. Tente novamente.');
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
            </ConfirmationModal>
        </div>
    );
}