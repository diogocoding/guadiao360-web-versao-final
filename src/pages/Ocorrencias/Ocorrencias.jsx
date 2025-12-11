// src/pages/Ocorrencias/Ocorrencias.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainHeader from '../../components/Header/MainHeader';
import styles from './ocorrencias.module.css';
import { API_BASE_URL } from '../../config/api';
import '../../styles/global.css';

const getStatusClass = (status) => {
    switch (status) {
        case 'Concluído': return styles.statusConcluido;
        case 'Andamento': return styles.statusAndamento;
        case 'Cancelado': return styles.statusCancelado;
        case 'Aberto': return styles.statusAberto;
        case 'Pendente': return styles.statusPendente;
        default: return '';
    }
};

const Ocorrencias = () => {
    const [occurrenceData, setOccurrenceData] = useState([]);
    const [statsData, setStatsData] = useState({ Total: 0, Aberto: 0, Pendente: 0, Andamento: 0, Concluído: 0, Cancelado: 0 });
    
    // Filtros
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroRegiao, setFiltroRegiao] = useState('');
    const [filtroPeriodo, setFiltroPeriodo] = useState('');

    const calcularDatas = (periodo) => {
        if (!periodo) return { inicio: '', fim: '' };
        const hoje = new Date();
        let inicio = new Date();
        
        if (periodo === 'hoje') {
            inicio = hoje;
        } else if (periodo === 'semana') {
            inicio.setDate(hoje.getDate() - 7);
        } else if (periodo === 'mes') {
            inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        } else if (periodo === 'ano') {
            inicio = new Date(hoje.getFullYear(), 0, 1);
        }

        const format = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        return { inicio: format(inicio), fim: format(hoje) };
    };

    const fetchData = () => {
        const tableParams = new URLSearchParams();
        const statsParams = new URLSearchParams();

        if (filtroStatus) tableParams.append('status', filtroStatus);
        if (filtroRegiao) {
            tableParams.append('regiao', filtroRegiao);
            statsParams.append('regiao', filtroRegiao);
        }

        const { inicio, fim } = calcularDatas(filtroPeriodo);
        if (inicio && fim) {
            tableParams.append('dataInicio', inicio);
            tableParams.append('dataFinal', fim);
        }

        fetch(`${API_BASE_URL}/api/ocorrencias?${tableParams.toString()}`)
            .then(response => response.json())
            .then(data => setOccurrenceData(data))
            .catch(error => console.error("Erro ocorrencias:", error));
            
        fetch(`${API_BASE_URL}/api/ocorrencias/stats?${statsParams.toString()}`)
            .then(response => response.json())
            .then(data => setStatsData(data))
            .catch(error => console.error("Erro stats:", error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilterSubmit = () => {
        fetchData(); 
    };

    const HeaderActions = (
        <button className="btn btnPrimary">
            <i className="fa-solid fa-plus"></i> Registrar Nova ocorrência
        </button>
    );

    return (
        <div className="dashboardContainer">
            <Sidebar />
            <main className="mainContent">
                <MainHeader title="Lista de Ocorrências" actions={HeaderActions} />

                <section className={styles.filtersSection}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="status">Status:</label>
                        <select id="status" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Aberto">Aberto</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Andamento">Andamento</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="regiao">Região:</label>
                         <select id="regiao" value={filtroRegiao} onChange={(e) => setFiltroRegiao(e.target.value)}>
                            <option value="">Todas</option>
                            <option value="Norte">Norte</option>
                            <option value="Sul">Sul</option>
                            <option value="Centro">Centro</option>
                            <option value="Oeste">Oeste</option>
                            <option value="Jaboatão">Jaboatão</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="periodo">Período:</label>
                         <select id="periodo" value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
                            <option value="">Todo o Histórico</option>
                            <option value="hoje">Hoje</option>
                            <option value="semana">Últimos 7 dias</option>
                            <option value="mes">Este Mês</option>
                            <option value="ano">Este Ano</option>
                        </select>
                    </div>

                    <button className={`btn ${styles.btnFilter}`} onClick={handleFilterSubmit}>
                        <i className="fa-solid fa-filter"></i> Filtrar
                    </button>
                </section>

                <section className={styles.statsSection}>
                    <div className={`${styles.statCard} ${styles.abertos}`}>
                        <span className={styles.count}>{statsData.Aberto}</span>
                        <span className={styles.label}>ABERTOS</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.pendentes}`}>
                        <span className={styles.count}>{statsData.Pendente + statsData.Andamento}</span>
                        <span className={styles.label}>PENDENTES</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.concluidos}`}>
                        <span className={styles.count}>{statsData.Concluído}</span>
                        <span className={styles.label}>CONCLUÍDOS</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.cancelados}`}>
                        <span className={styles.count}>{statsData.Cancelado}</span>
                        <span className={styles.label}>CANCELADOS</span>
                    </div>
                </section>

                <section className={styles.tableSection}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo de Ocorrências</th>
                                <th>Data</th> {/* <--- NOVA COLUNA HEADER */}
                                <th>Status</th>
                                <th>Local</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {occurrenceData.length > 0 ? (
                                occurrenceData.map((item) => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td>
                                            <i className={`fa-solid ${item.icone_classe} ${styles.iconRed}`}></i>
                                            {item.tipo_ocorrencia}
                                        </td>
                                        {/* --- NOVA COLUNA BODY --- */}
                                        {/* Exibe Data formatada PT-BR */}
                                        <td>{new Date(item.data_hora).toLocaleDateString('pt-BR')}</td>
                                        
                                        <td>
                                            <span className={`${styles.statusPill} ${getStatusClass(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.localizacao}</td>
                                        <td>
                                            <Link to={`/ocorrencia/${item.id}`} className={`btn ${styles.btnDetails}`}>
                                                Ver Detalhes
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{textAlign:'center', padding:'30px', color:'#777'}}>
                                        Nenhuma ocorrência encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default Ocorrencias;