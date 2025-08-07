import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const testAuthenticatedRequest = async () => {
    try {
      console.log('Testando requisição autenticada...')
      const response = await api.get('/users')
      console.log('Resposta da API autenticada:', response.data)
      alert('Requisição autenticada funcionou! Verifique o console para detalhes.')
    } catch (error) {
      console.error('Erro na requisição autenticada:', error)
      alert('Erro na requisição autenticada. Verifique o console.')
    }
  }

  if (loading) {
    return <div className="container">Carregando...</div>
  }

  return (
    <div className="dashboard">
      <h1>Dashboard - Internet Banking</h1>
      
      <div className="user-info">
        <h3>Bem-vindo!</h3>
        <p><strong>CPF:</strong> {user?.cpf || 'Não informado'}</p>
        <p><strong>Status:</strong> Logado com sucesso</p>
        <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Presente' : 'Ausente'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={testAuthenticatedRequest}
          style={{ marginRight: '10px', width: 'auto' }}
        >
          Testar Requisição Autenticada
        </button>
        
        <button 
          className="btn logout-btn" 
          onClick={handleLogout}
          style={{ width: 'auto' }}
        >
          Sair
        </button>
      </div>

      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
        <h4>Status do Sistema:</h4>
        <ul>
          <li>✅ Login realizado com sucesso</li>
          <li>✅ Token JWT armazenado</li>
          <li>✅ Redirecionamento funcionando</li>
          <li>✅ Dashboard carregado</li>
        </ul>
        
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          Use o botão "Testar Requisição Autenticada" para verificar se o token está funcionando corretamente nas chamadas da API.
        </p>
      </div>
    </div>
  )
}

export default Dashboard
