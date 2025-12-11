// src/pages/Auditoria/Auditoria.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainHeader from '../../components/Header/MainHeader';
import styles from './auditoria.module.css';
import '../../styles/global.css';
import { API_BASE_URL } from '../../config/api';

const Auditoria = () => {
    
    // Estados (Sem mudanças)
    const [filtroDescricao, setFiltroDescricao] = useState('');
    const [filtroEvento, setFiltroEvento] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [logData, setLogData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Funções de Fetch e Handlers (Sem mudanças)
    const fetchLogs = (pageToFetch) => {
        const params = new URLSearchParams();
        if (filtroDescricao) params.append('descricao', filtroDescricao);
        if (filtroEvento) params.append('evento', filtroEvento);
        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFinal) params.append('dataFinal', dataFinal);
        params.append('page', pageToFetch); 
        fetch(`${API_BASE_URL}/api/auditoria?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                setLogData(data.data);
                setTotalPages(data.pagination.totalPages);
                setCurrentPage(data.pagination.page);
            })
            .catch(error => console.error("Erro ao buscar logs:", error));
    };
    useEffect(() => { fetchLogs(1); }, []); 
    const handleFilterSubmit = () => { setCurrentPage(1); fetchLogs(1); };
    const handleNextPage = () => {
        const nextPage = Math.min(currentPage + 1, totalPages);
        if (nextPage !== currentPage) fetchLogs(nextPage);
    };
    const handlePrevPage = () => {
        const prevPage = Math.max(currentPage - 1, 1);
        if (prevPage !== currentPage) fetchLogs(prevPage);
    };

    return (
    <div className="dashboardContainer">
      <Sidebar />
      <main className="mainContent grayBackground">
        
        <MainHeader 
          title="Auditoria e Logs de Ações"
          actions={<></>}
        />

        {/* ===============================================
          ✅ SEÇÃO DE FILTROS REORGANIZADA (3 em cima, 2+1 embaixo)
          ===============================================
        */}
        <section className={styles.filtersContainer}>
          
          {/* Linha 1: 3 Filtros Superiores */}
          <div className={`${styles.filterRow} ${styles.top}`}>
            <div className={styles.filterItem}>
              <label htmlFor="filtro-usuario">Filtrar por Usuário:</label>
              <select id="filtro-usuario">
                <option>Selecione o tipo de Usuário</option>
              </select>
            </div>

            <div className={styles.filterItem}>
              <label htmlFor="filtro-evento">Filtro por Tipo de Evento:</label>
              <select 
                  id="filtro-evento"
                  value={filtroEvento}
                  onChange={(e) => setFiltroEvento(e.target.value)}
              >
                <option value="">Selecione o Evento</option>
                <option value="LOGIN">LOGIN</option>
                <option value="REUNIÃO">REUNIÃO</option>
                <option value="EDIÇÃO_USUÁRIO">EDIÇÃO_USUÁRIO</option>
              </select>
            </div>
            
            <div className={styles.filterItem}>
              <label htmlFor="filtro-descricao">Filtro por Descrição da Ação:</label>
              <input
                type="text"
                id="filtro-descricao"
                placeholder="Digite palavras-chave"
                value={filtroDescricao}
                onChange={(e) => setFiltroDescricao(e.target.value)}
              />
            </div>
          </div>

          {/* Linha 2: 2 Filtros de Data (Esquerda) + Botão (Direita) */}
          <div className={`${styles.filterRow} ${styles.date}`}>
            
            {/* Coluna 1: Data Início */}
            <div className={styles.filterItem}>
              <label htmlFor="data-inicio">Período (Início):</label>
              <input
                type="date"
                id="data-inicio"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            {/* Coluna 2: Data Final */}
            <div className={styles.filterItem}>
              <label htmlFor="data-final">Período (Final):</label>
              <input
                type="date"
                id="data-final"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </div>

            {/* Coluna 3: Botão Alinhado */}
            <div className={`${styles.filterItem} ${styles.buttonGroup}`}>
              <label>&nbsp;</label> {/* Label vazio para alinhar verticalmente */}
              <button className={styles.btnFilter} onClick={handleFilterSubmit}>
                  Aplicar Filtros
              </button>
            </div>
          </div>

          {/* ❌ Linha 3 (Botão separado) REMOVIDA ❌ */}

        </section>

        {/* ===============================================
          ✅ SEÇÃO DE TABELA (Sem mudanças)
          ===============================================
        */}
        <section className={styles.tableContainer}>
            {/* ... (O restante do JSX da tabela e paginação permanece o mesmo) ... */}
            <div className={styles.tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Usuário</th>
                            <th>Matrícula</th>
                            <th>Evento</th>
                            <th>Detalhes da Ação</th>
                            <th>ID Ocorrência</th>
                            <th>IP de Origem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData.map((log) => (
                            <tr key={log.id}>
                                <td>{new Date(log.data_hora).toLocaleString('pt-BR')}</td>
                                <td>{log.usuario_email}</td>
                                <td>{log.usuario_matricula}</td>
                                <td>{log.evento_tipo}</td>
                                <td>{log.detalhes}</td>
                                <td>{log.ocorrencia_id_relacionada}</td>
                                <td>{log.ip_origem}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <footer className={styles.paginationFooter}>
                <span className={styles.pageInfo}>
                    Página {currentPage} de {totalPages || 1}
                </span>
                <div className={styles.pageNav}>
                    <button 
                        className={`${styles.btnNav} ${styles.btnPrev}`}
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        <i className="fa-solid fa-chevron-left"></i> Anterior
                    </button>
                    <button 
                        className={`${styles.btnNav} ${styles.btnNext}`}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Próximo <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </footer>
        </section>
      </main>
    </div>
  );
};

export default Auditoria;