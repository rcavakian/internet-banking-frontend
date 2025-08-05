import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RotaProtegida from "./components/RotaProtegida";
import Dashboard from "./pages/Dashboard";
import Saque from "./pages/Saque";
import Deposito from "./pages/Deposito";
import Pagamento from "./pages/Pagamento";
import Extrato from "./pages/Extrato";
import Erro from "./pages/Erro";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route
                    path="/dashboard"
                    element={
                        <RotaProtegida>
                            <Dashboard />
                        </RotaProtegida>
                    }
                />
                <Route
                    path="/deposito"
                    element={
                        <RotaProtegida>
                            <Deposito />
                        </RotaProtegida>
                    }
                />
                <Route
                    path="/saque"
                    element={
                        <RotaProtegida>
                            <Saque />
                        </RotaProtegida>
                    }
                />
                <Route
                    path="/pagamento"
                    element={
                        <RotaProtegida>
                            <Pagamento />
                        </RotaProtegida>
                    }
                />
                <Route
                    path="/extrato"
                    element={
                        <RotaProtegida>
                            <Extrato />
                        </RotaProtegida>
                    }
                />
                <Route path="*" element={<Erro />} />

            </Routes>
        </BrowserRouter>)
}