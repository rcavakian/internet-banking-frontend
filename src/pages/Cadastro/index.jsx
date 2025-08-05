import { useState } from "react"; // Importamos o useState
import { useNavigate, Link } from 'react-router-dom'; // Para redirecionar o usuário
import { IMaskInput } from 'react-imask';
import axios from 'axios'; // Para fazer a chamada à API
import './Cadastro.css';
import carameloMascote from '../../assets/caramelo.png';


export default function Login() {
    // Estados para armazenar os dados do formulário
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Função que será chamada quando o formulário for enviado
    const handleCadastro = async (event) => {
        event.preventDefault(); // Impede o recarregamento padrão da página

        // Validação simples
        if (!name || !cpf || !email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // Aqui você faremos a chamada para a API
            // Substitua 'http://localhost:8080/auth/login' pela URL real do seu endpoint de login
            const response = await axios.post('http://localhost:8080/auth/login', {
                // O backend pode esperar 'email' ou 'cpf', ajuste conforme necessário
                name: name,
                cpf: cpf,
                email: email,
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
        <div className="cadastro-page-wrapper">
            <div className="cadastro-branding">
                <img src={carameloMascote} alt="Mascote do Banco Caramelo" className="branding-image" />
                <h1 className="branding-title">Banco Caramelo</h1>
                <p className="branding-subtitle">Seu amigo para todas as horas.</p>
            </div>

            <div className="cadastro-container">
                <div className="cadastro-form">
                    <h2>Acesse sua conta</h2>
                    <form onSubmit={handleCadastro}>
                        <div className="input-group">
                            <label htmlFor="name">Nome</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="insira seu nome completo"
                                value={name} // Conecta o input ao estado 'email'
                                onChange={(e) => setName(e.target.value)} // Atualiza o estado a cada digitação
                            />
                        </div>
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
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                id="email"
                                placeholder="insira seu e-mail"
                                value={email} // Conecta o input ao estado 'email'
                                onChange={(e) => setEmail(e.target.value)} // Atualiza o estado a cada digitação
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
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="cadastro-button">Cadastrar</button>
                        <p className="login-link">
                            Já tem uma conta? <Link to="/login">Faça o login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
