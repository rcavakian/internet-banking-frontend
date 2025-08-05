import { Link } from 'react-router-dom';
import './Erro.css';
import carameloMascote from '../../assets/caramelo.png';

export default function Erro() {
    return (
        <div className="error-page-container">
            <div className="error-content">
                <img src={carameloMascote} alt="Mascote Caramelo Confuso" className="error-mascot" />
                <h1>Oops! Página não encontrada.</h1>
                <p>
                    Nosso amigão procurou por todo lado, mas não encontrou a página que você queria.
                </p>
                <Link to="/" className="error-button">
                    Voltar para a página inicial
                </Link>
            </div>
        </div>
    );
}