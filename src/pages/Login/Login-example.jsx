import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import api from "../../services/api";
import './Login.css';
import carameloMascote from '../../assets/caramelo.png';

export default function Login() {
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        if (!cpf || !password) {
            setError('Por favor, preencha todos os campos.');
            setLoading(false);
            return;
        }

        try {
            // ✅ AQUI É ONDE O TOKEN É RECEBIDO
            const response = await api.post('/login', {
                login: cpf,
                password: password
            });

            console.log('Login bem-sucedido:', response.data);

            // ✅ SALVAR O TOKEN NO LOCALSTORAGE
            localStorage.setItem('user_token', response.data.token);

            // ✅ REDIRECIONAR PARA O DASHBOARD
            navigate('/dashboard');

        } catch (err) {
            console.error('Erro no login:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('CPF ou senha incorretos.');
            } else {
                setError('Erro no servidor. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-branding">
                <img src={carameloMascote} alt="Mascote do Banco Caramelo" className="branding-image" />
                <h1 className="branding-title">Banco Caramelo</h1>
                <p className="branding-subtitle">Seu amigo para todas as horas</p>
            </div>
            
            <div className="login-container">
                <div className="login-form">
                    <h2>Acesse sua conta</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="cpf">CPF</label>
                            <IMaskInput
                                mask="000.000.000-00"
                                id="cpf"
                                placeholder="insira seu CPF"
                                value={cpf}
                                onAccept={(value) => setCpf(value)}
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="insira sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                    
                    <p className="signup-link">
                        Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
