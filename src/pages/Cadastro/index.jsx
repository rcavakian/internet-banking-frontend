import { useState } from "react"; // Importamos o useState
import { useNavigate, Link } from 'react-router-dom'; // Para redirecionar o usuário
import { IMaskInput } from 'react-imask';
import api from '../../services/api'; // Usar a API service configurada
import './Cadastro.css';
import carameloMascote from '../../assets/caramelo.png';


export default function Login() {
    // Estados para armazenar os dados do formulário
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Estado para armazenar mensagens de erro e sucesso
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    // Função que será chamada quando o formulário for enviado
    const handleCadastro = async (event) => {
        event.preventDefault(); // Impede o recarregamento padrão da página

        // Validação simples
        if (!name || !cpf || !email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, insira um email válido.');
            return;
        }

        // Validação de CPF (deve ter 11 dígitos)
        const cpfLimpo = cpf.replace(/\D/g, '');
        if (cpfLimpo.length !== 11) {
            setError('Por favor, insira um CPF válido.');
            return;
        }

        setError('');
        setSuccess('');

        try {
            // Chamada para o endpoint correto de cadastro de usuários
            const response = await api.post('/users', {
                name: name,
                cpf: cpfLimpo, // CPF já limpo
                email: email,
                passwordHash: password
            });

            // Se o cadastro for bem-sucedido:
            console.log('Cadastro bem-sucedido:', response.data);
            setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');

            // Redirecionar para a página de login após 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            // Se a API retornar um erro
            console.error('Erro no cadastro:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Erro ao realizar cadastro. Verifique os dados e tente novamente.');
            }
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
                    <h2>Criar sua conta</h2>
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
                        {success && <p className="success-message">{success}</p>}
                        <button type="submit" className="cadastro-button" disabled={success}>
                            {success ? 'Redirecionando...' : 'Cadastrar'}
                        </button>
                        <p className="login-link">
                            Já tem uma conta? <Link to="/login">Faça o login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
