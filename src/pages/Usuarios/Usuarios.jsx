// pages/Usuarios/Usuarios.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Usando Link para navegação futura
import Sidebar from '../../components/Sidebar/Sidebar';
import MainHeader from '../../components/Header/MainHeader';
import styles from './usuarios.module.css'; // Importa os estilos modulares locais
import '../../styles/global.css'; // Importa estilos de layout global

// Dados mockados (baseado no gestao-usuarios.html)
const userData = [
    { nome: 'Pedro Alcântara', matricula: '00123456', posto: 'Coronel', lotacao: 'QG - Comando Geral', perfil: 'ADM', status: 'Ativo' },
    { nome: 'Ana Luiza Santos', matricula: '00298765', posto: 'Capitã', lotacao: '1º BBM (Zona Sul)', perfil: 'Chefe / Supervisor', status: 'Ativo' },
    { nome: 'João Victor Souza', matricula: '00355443', posto: '1º Sargento', lotacao: 'DAT (Engenharia)', perfil: 'Analista', status: 'Ativo' },
    { nome: 'Lucas Ferreira Costa', matricula: '00478901', posto: 'Soldado', lotacao: '2º BBM (Zona Norte)', perfil: 'Padrão / Operacional', status: 'Ativo' },
    { nome: 'Marta Oliveira Dias', matricula: '00565656', posto: 'Cabo', lotacao: 'DTI (Suporte)', perfil: 'Analista', status: 'Inativo' },
    { nome: 'Fernanda Cibelly', matricula: '00636958', posto: 'Sargento', lotacao: 'CBMPE', perfil: 'Analista', status: 'Ativo' },
];

const Usuarios = () => {
  return (
    // Classes de layout globais
    <div className="dashboardContainer">
      <Sidebar />
      <main className="mainContent">
        
        <MainHeader 
          title="Gestão de Usuários"
          actions={<></>} // O HTML não define ações no header
        />

        {/* Botão Adicionar Usuário (Estilos do Modulo) */}
        <section className={styles.buttonContainer}>
          <button className={styles.btnAddUser}>
            <i className="fa-solid fa-plus"></i> Adicionar Novo Usuário
          </button>
        </section>

        {/* Filtros (Estilos do Modulo) */}
        <section className={`${styles.filtersSection} ${styles.userFilters}`}>
          <div className={styles.filterGroup}>
            <label htmlFor="perfil">Perfil/Acesso:</label>
            <select id="perfil">
              <option>Selecione o Perfil</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="unidade">Unidade/Lotação:</label>
            <select id="unidade">
              <option>Selecione sua Unidade</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="status">Status:</label>
            <select id="status">
              <option>Selecione o status</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="posto">Posto/Graduação:</label>
            <select id="posto">
              <option>Selecione o Posto / Graduação</option>
            </select>
          </div>
        </section>

        {/* Container da Tabela (Estilos do Modulo) */}
        <section className={styles.tableContainer}>
          <h3 className={styles.tableTitle}>Registro de Usuários do Sistema</h3>

          <div className={styles.tableWrapper}>
            {/* A tabela será estilizada pelo CSS Module (`.tableContainer table`) */}
            <table>
              <thead>
                <tr>
                  <th>Nome Completo</th>
                  <th>Matrícula</th>
                  <th>Posto / Graduação</th>
                  <th>Unidade / Lotação</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.matricula}>
                    <td>{user.nome}</td>
                    <td>{user.matricula}</td>
                    <td>{user.posto}</td>
                    <td>{user.lotacao}</td>
                    <td>{user.perfil}</td>
                    {/* Aplicando classes de status do Modulo */}
                    <td className={user.status === 'Ativo' ? styles.statusAtivo : styles.statusInativo}>
                      {user.status}
                    </td>
                    <td className={styles.actions}>
                      <Link to="#">Editar</Link> / <Link to="#">Redefinir</Link> / <Link to="#">Excluir</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação (Estilos do Modulo) */}
          <footer className={styles.paginationFooter}>
            <span className={styles.pageInfo}>Página 1 de 5</span>
            <div className={styles.pageNav}>
              <Link to="#" className={styles.prev}>
                <i className="fa-solid fa-chevron-left"></i> Anterior
              </Link>
              <Link to="#" className={styles.next}>
                Próxima <i className="fa-solid fa-chevron-right"></i>
              </Link>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default Usuarios;