// src/components/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { API_BASE_URL } from '../../config/api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // BYPASS TEMPORÁRIO PARA TESTES
      if (email === 'admin' && senha === 'admin') {
        localStorage.setItem('user', JSON.stringify({ name: 'Admin Local', permissions: 'admin' }));
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: email, senha: senha }),
      });

      const data = await response.json();

      if (data.success) {
        // Salva dados básicos do usuário (opcional, para exibir no header)
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/'); // Redireciona para o Dashboard/Ocorrências
      } else {
        setError(data.message || 'Falha no login');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    }
  };

  const Logo = (
    <div className={styles.logoContainer}>
      <img
        src="https://i.postimg.cc/28YgB6z9/Gemini-Generated-Image-tr1uhatr1uhatr1u-8.png"
        alt="Brasão Guardião 360"
        style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
      />
      <h1 className={styles.tituloGuardiao}>GUARDIÃO 360°</h1>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h2>FAÇA LOGIN</h2>
        <p className={styles.acessoRestrito}>ACESSO RESTRITO: GESTÃO INTERNA</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email">Email ou matrícula</label>
          <input
            id="email"
            type="text"
            placeholder="Ex: admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={styles.inputField}
            required
          />

          {error && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className={styles.botaoEntrar}>
            ENTRAR
          </button>
        </form>
      </div>
      {Logo}
    </div>
  );
}

export default Login;