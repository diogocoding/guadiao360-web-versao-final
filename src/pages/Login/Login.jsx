// src/components/Login/Login.jsx
import React, { useState } from 'react';
import styles from './Login.module.css';

// Importe o logo/brasão aqui.
// Você precisará salvar a imagem do brasão (LOGIN (1).jpg - parte da direita)
// em um local como 'src/assets/logo.png' ou usar uma URL.
// Exemplo:
// import logoGuadiao from '../../assets/logo-guardiao.png'; 

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticação aqui
    console.log('Login Tentado:', { email, senha, lembrar });
  };

  // OBS: Como não tenho a imagem para importar diretamente, usarei um 'div'
  // com um placeholder para o logotipo.
  const Logo = (
    <div className={styles.logoContainer}>
      {/* Use uma tag <img> real com seu caminho de arquivo aqui */}
      {/* <img src={logoGuadiao} alt="Brasão do Corpo de Bombeiros e Tocha" /> */}
      <div className={styles.logoPlaceholder}>
        {/* Este é um PLACEHOLDER! Adicione sua imagem real */}
      </div>
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
            placeholder="seu.email@cbm.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={styles.inputField}
            // OBS: O input de senha está com bolinhas na imagem, o que é o padrão 'type="password"'
          />

          <div className={styles.lembrarMe}>
            <input
              id="lembrar"
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
            />
            <label htmlFor="lembrar">LEMBRAR-ME</label>
          </div>

          <button type="submit" className={styles.botaoEntrar}>
            ENTRAR
          </button>

          <a href="#" className={styles.linkEsqueciSenha}>
            Esqueceu a Senha?
          </a>
        </form>
      </div>

      {/* Lado direito da imagem */}
      {Logo}
    </div>
  );
}

export default Login;