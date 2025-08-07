import { useNavigate, Link } from "react-router-dom";
import { useAuth, useUserAccounts } from "../../hooks/useAuth";
import "./Dashboard.css";
import carameloMascote from "../../assets/caramelo.png"

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { accounts, loading } = useUserAccounts();

    const handleLogout = () => {
        logout();
        navigate("/login")
    };

    // Pegar a primeira conta do usuário (ou saldo total se houver múltiplas)
    const balance = accounts.length > 0 ? accounts[0].balance || 0 : 0;
    const userName = user?.name || user?.cpf || "Usuário";
    const userAccount = accounts.length > 0 ? accounts[0] : null;

    if (loading) {
        return (
            <div className="dashboard-page">
                <header className="dashboard-navbar">
                    <h1 className="navbar-title">Banco Caramelo</h1>
                    <button onClick={handleLogout} className="logout-button">Sair</button>
                </header>
                <main className="dashboard-main-content">
                    <p>Carregando...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-navbar">
                <h1 className="navbar-title">Banco Caramelo</h1>
                <button onClick={handleLogout} className="logout-button">Sair</button>
            </header>
            <main className="dashboard-main-content">
                <section className="welcome-hero">
                    <div className="welcome-text">
                        <h2>Olá, {userName}!</h2>
                        <p>Que bom te ver por aqui. Pronto para organizar suas finanças?</p>
                        {userAccount && (
                            <div className="account-info">
                                <div className="account-details">
                                    <span className="account-label">Agência</span>
                                    <span className="account-label">Conta Corrente</span>
                                </div>
                                <div className="account-numbers">
                                    <span className="account-number">{userAccount.agency || '0001'}</span>
                                    <span className="account-number">{userAccount.number}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <img
                        src={carameloMascote}
                        alt="Mascote Caramelo"
                        className="hero-mascot"
                    />
                </section>

                <section className="dashboard-cards">
                    <div className="card balance-card">
                        <h3>Saldo em conta</h3>
                        <p className="balance-amount">
                            R$ {balance.toLocaleString('pt-br', { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="card actions-card">
                        <h3>Ações rápidas</h3>
                        <div className="actions-buttons">
                            <Link to="/deposito" className="action-button">Depositar</Link>
                            <Link to="/saque" className="action-button">Sacar</Link>
                            <Link to="/pagamento" className="action-button">Pagar</Link>
                        </div>
                    </div>

                    <div className="card statement-card">
                        <h3>Extrato</h3>
                        <p>Consulte suas últimas movimentações</p>
                        <Link to="/extrato" className="statement-link">Ver Extrato Completo</Link>
                    </div>
                </section>
            </main>
        </div>
    )
}