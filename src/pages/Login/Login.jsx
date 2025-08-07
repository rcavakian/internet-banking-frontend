import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

const Login = () => {
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Remover pontos e traços do CPF para enviar apenas números
      const cpfLimpo = cpf.replace(/\D/g, '')
      
      const response = await api.post('/login', {
        login: cpfLimpo,
        password: password
      })

      console.log('Login realizado com sucesso!')

      if (response.data.token) {
        // Salvar token no localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user || { cpf }))
        
        console.log('Login realizado com sucesso!')
        navigate('/dashboard')
      } else {
        setError('Token não encontrado na resposta')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      
      if (error.response) {
        // Erro do servidor
        setError(error.response.data.message || `Erro ${error.response.status}: ${error.response.statusText}`)
      } else if (error.request) {
        // Erro de rede
        setError('Erro de conexão. Verifique se o servidor está rodando.')
      } else {
        // Outro erro
        setError('Erro inesperado: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    }
    return value
  }

  const handleCpfChange = (e) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
  }

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Internet Banking - Login
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
            maxLength="14"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        
        {error && (
          <div className="error">
            {error}
          </div>
        )}
      </form>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Para teste, use:</strong><br />
        CPF: 111.111.111-11<br />
        Senha: 123456
      </div>
    </div>
  )
}

export default Login
