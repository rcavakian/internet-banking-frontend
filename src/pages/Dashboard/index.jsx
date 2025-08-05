import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import carameloMascote from "../../assets/caramelo.png"

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user_token");
        navigate("/login")
    };

    // dados mockados
    const userName = "Usuário";
    const balance = 1250.75;

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