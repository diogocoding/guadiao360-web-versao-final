// pages/Ocorrencias/Ocorrencias.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainHeader from '../../components/Header/MainHeader';
import styles from './ocorrencias.module.css';
import '../../styles/global.css';

// ... (função getStatusClass permanece a mesma) ...
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
    // ... (todos os seus states e funções fetch permanecem os mesmos) ...
    const [occurrenceData, setOccurrenceData] = useState([]);
    const [statsData, setStatsData] = useState({ 
        Aberto: 0, 
        Pendente: 0, 
        Andamento: 0, 
        Concluído: 0, 
        Cancelado: 0 
    });
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroRegiao, setFiltroRegiao] = useState('');

    const fetchData = () => {
        const tableParams = new URLSearchParams();
        if (filtroStatus) tableParams.append('status', filtroStatus);
        if (filtroRegiao) tableParams.append('regiao', filtroRegiao);

        const statsParams = new URLSearchParams();
        if (filtroRegiao) statsParams.append('regiao', filtroRegiao);

        fetch(`http://localhost:3001/api/ocorrencias?${tableParams.toString()}`)
            .then(response => response.json())
            .then(data => {
                setOccurrenceData(data); 
            })
            .catch(error => console.error("Erro ao buscar ocorrências:", error));
            
        fetch(`http://localhost:3001/api/ocorrencias/stats?${statsParams.toString()}`)
            .then(response => response.json())
            .then(data => {
                setStatsData(data);
            })
            .catch(error => console.error("Erro ao buscar stats:", error));
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
                
                <MainHeader 
                    title="Lista de Ocorrências"
                    actions={HeaderActions}
                />

                {/* ... (Seção de Filtros permanece a mesma) ... */}
                <section className={styles.filtersSection}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="status">Status:</label>
                        <select 
                            id="status" 
                            value={filtroStatus} 
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="">Selecione o status</option>
                            <option value="Aberto">Aberto</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Andamento">Andamento</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label htmlFor="regiao">Região:</label>
                         <select 
                            id="regiao"
                            value={filtroRegiao}
                            onChange={(e) => setFiltroRegiao(e.target.value)}
                         >
                            <option value="">Selecione a região</option>
                            <option value="Norte">Norte</option>
                            <option value="Sul">Sul</option>
                            <option value="Centro">Centro</option>
                            <option value="Oeste">Oeste</option>
                            <option value="Jaboatão">Jaboatão</option>
                        </select>
                    </div>
                    <button className={`btn ${styles.btnFilter}`} onClick={handleFilterSubmit}>Filtrar Informações</button>
                </section>

                {/* ... (Seção de Stats permanece a mesma) ... */}
                 <section className={styles.statsSection}>
                    <div className={`${styles.statCard} ${styles.abertos}`}>
                        <span className={styles.count}>{statsData.Aberto}</span>
                        <span className={styles.label}>ABERTOS</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.pendentes}`}>
                        <span className={styles.count}>{statsData.Pendente}</span>
                        <span className={styles.label}>PENDENTES</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.cancelados}`}>
                        <span className={styles.count}>{statsData.Cancelado}</span>
                        <span className={styles.label}>CANCELADOS</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.concluidos}`}>
                        <span className={styles.count}>{statsData.Concluído}</span>
                        <span className={styles.label}>CONCLUÍDOS</span>
                    </div>
                </section>

                {/* Container da Tabela (COM O THEAD CORRIGIDO) */}
                <section className={styles.tableSection}>
                    <table>
                        {/* ✅ CORREÇÃO: O CABEÇALHO ESTÁ DE VOLTA ✅ */}
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo de Ocorrências</th>
                                <th>Status</th>
                                <th>Local</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {occurrenceData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>
                                        <i className={`fa-solid ${item.icone_classe} ${styles.iconRed}`}></i>
                                        {item.tipo_ocorrencia}
                                    </td>
                                    <td>
                                        <span className={`${styles.statusPill} ${getStatusClass(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{item.localizacao}</td>
                                    <td>
                                        {item.status === 'Andamento' && (
                                            <Link to={`/ocorrencia/${item.id}`} className={`btn ${styles.btnDetails}`}>
                                                Ver Detalhes
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default Ocorrencias;