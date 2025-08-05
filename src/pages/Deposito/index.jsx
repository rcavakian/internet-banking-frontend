import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import api from '../../services/api';
import '../OperationPage.css';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function Deposito() {
    const [valor, setValor] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user_token");
        navigate("/login")
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(false); // Fecha o modal

        try {
            // await api.post('/operacoes/deposito', { valor });
            setSuccess(`Depósito de R$ ${valor} realizado com sucesso!`);
            setValor('');
        } catch (err) {
            console.error(err.message);
            setError('Não foi possível realizar o depósito. Tente novamente.');
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
                <p>Confirma o pagamento no valor de <strong>R$ {parseFloat(valor || 0).toFixed(2)}</strong>?</p>
            </ConfirmationModal>
        </div>
    );
}