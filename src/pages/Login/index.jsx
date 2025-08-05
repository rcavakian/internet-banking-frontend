import { useState } from "react"; // Importamos o useState
import { useNavigate, Link } from 'react-router-dom'; // Para redirecionar o usuário
import { IMaskInput } from 'react-imask';
import api from "../../services/api"; // Para fazer a chamada à API
import './Login.css';
import carameloMascote from '../../assets/caramelo.png';

export default function Login() {
    // Estados para armazenar os dados do formulário
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Função que será chamada quando o formulário for enviado
    const handleLogin = async (event) => {
        event.preventDefault(); // Impede o recarregamento padrão da página

        // Validação simples
        if (!cpf || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // Aqui você faremos a chamada para a API
            // Substitua 'http://localhost:8080/auth/login' pela URL real do seu endpoint de login
            const response = await api.post('http://localhost:8080/auth/login', {
                // O backend pode esperar 'email' ou 'cpf', ajuste conforme necessário
                login: cpf,
                senha: password
            });

            // Se o login for bem-sucedido:
            console.log('Login bem-sucedido:', response.data);

            // 1. Armazene o token de autenticação (geralmente em localStorage)
            // localStorage.setItem('user_token', response.data.token);

            // 2. Redirecione o usuário para o dashboard
            navigate('/');

        } catch (err) {
            // Se a API retornar um erro (ex: 401 Unauthorized)
            setError('Credenciais inválidas. Verifique seu CPF e senha.');
            console.error('Erro no login:', err);
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
                            >
                            </IMaskInput>
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="insira sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="login-button">Entrar</button>
                    </form>
                    <p className="signup-link">
                        Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
                    </p>
                </div>
            </div>
        </div>

    );
}