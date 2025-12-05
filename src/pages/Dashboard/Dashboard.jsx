// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainHeader from '../../components/Header/MainHeader';
import styles from './dashboard.module.css';
import '../../styles/global.css';

const Dashboard = () => {
  // Estados para dados reais
  const [stats, setStats] = useState({ Total: 0, Aberto: 0, Pendente: 0, Andamento: 0, Concluído: 0, Cancelado: 0 });
  const [recentes, setRecentes] = useState([]);
  const [tiposData, setTiposData] = useState([]); // Para uso futuro no gráfico

  // 1. Carregar Dados da API
  useEffect(() => {
    // KPI Stats (Aberto, Pendente, etc.)
    fetch('http://localhost:3001/api/ocorrencias/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Erro stats:", err));

    // Ocorrências Recentes (Lista Lateral)
    fetch('http://localhost:3001/api/dashboard/recentes')
      .then(res => res.json())
      .then(data => setRecentes(data))
      .catch(err => console.error("Erro recentes:", err));

    // Tipos para gráfico (Opcional por enquanto)
    fetch('http://localhost:3001/api/dashboard/tipos')
      .then(res => res.json())
      .then(data => setTiposData(data))
      .catch(err => console.error("Erro tipos:", err));
  }, []);

  // Função auxiliar para cor das badges
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Concluído': return styles.badgeVerde;
      case 'Andamento': return styles.badgeLaranja;
      case 'Pendente': return styles.badgeAmarelo;
      case 'Aberto': return styles.badgeVermelho;
      case 'Cancelado': return styles.badgeVermelho;
      default: return styles.badgeAmarelo;
    }
  };

  // Mock de Equipes (Simulação baseada na imagem)
  const mockTeams = [
    { id: 1, nome: 'Equipe Alpha (ABT-12)', detalhe: '5 Membros - Disponível' },
    { id: 2, nome: 'Equipe Bravo (AR-05)', detalhe: '4 Membros - Em Deslocamento' },
    { id: 3, nome: 'Equipe Charlie (ASE-03)', detalhe: '5 Membros - Atendimento' },
  ];

  // Mock de Gráfico (Semanal)
  const weeklyData = [15, 25, 20, 10, 12, 18, 22]; 

  return (
    <div className="dashboardContainer">
      <Sidebar />
      <main className={`mainContent ${styles.mainContentOverride}`}>
        
        <MainHeader title="Dashboard Operacional" actions={<></>} />

        {/* 1. TOPO: 4 Cards Compactos */}
        <section className={styles.topCardsContainer}>
          
          {/* Card Vermelho: Abertos */}
          <div className={`${styles.kpiCard} ${styles.cardRoxo}`}>
            <i className={`fa-solid fa-bell ${styles.cardIcon}`}></i>
             <span className={styles.cardText}>
                Abertos: {stats.Aberto}
             </span>
          </div>

          {/* Card Amarelo: Pendentes */}
          <div className={`${styles.kpiCard} ${styles.cardAmarelo}`}>
             <i className={`fa-solid fa-triangle-exclamation ${styles.cardIcon}`}></i>
             <span className={styles.cardText}>
                Pendentes: {stats.Pendente}
             </span>
          </div>

          {/* Card Laranja: Em Andamento */}
          <div className={`${styles.kpiCard} ${styles.cardLaranja}`}>
             <i className={`fa-solid fa-spinner ${styles.cardIcon}`}></i>
             <span className={styles.cardText}>
                Em Andamento: {stats.Andamento}
             </span>
          </div>

          {/* Card Verde: Concluídos */}
          <div className={`${styles.kpiCard} ${styles.cardVerde}`}>
             <i className={`fa-solid fa-check-circle ${styles.cardIcon}`}></i>
             <span className={styles.cardText}>
                Concluídos: {stats.Concluído}
             </span>
          </div>

        </section>

        {/* 2. MEIO: Mapa e Lista Recente */}
        <section className={styles.middleSection}>
            
            {/* Mapa Operacional (Esquerda) */}
            <div className={styles.sectionCard}>
                <div className={styles.cardTitle}>
                    <span>Mapa operacional</span>
                    <select style={{padding: '5px', borderRadius: '4px', border: '1px solid #ddd', fontSize:'0.8rem'}}>
                        <option>Todas as regiões</option>
                    </select>
                </div>
                {/* Iframe do Google Maps */}
                <iframe 
                    className={styles.mapFrame}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.3603071803923!2d-34.88245778921003!3d-8.064681991929543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18b991a6d277%3A0xda5638ae78a7fbdc!2sR.%20das%20Fl%C3%B4res%20-%20Santo%20Ant%C3%B4nio%2C%20Recife%20-%20PE%2C%2052021-210!5e0!3m2!1sen!2sbr!4v1761126336330!5m2!1sen!2sbr" 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa Operacional"
                ></iframe>
            </div>

            {/* Ocorrências Recentes (Direita) */}
            <div className={styles.sectionCard}>
                <div className={styles.cardTitle}>Ocorrências Recentes</div>
                <div className={styles.recentList}>
                    {recentes.length > 0 ? (
                        recentes.map((item) => (
                            <div key={item.id} className={styles.recentItem}>
                                {/* Ícone dinâmico do banco */}
                                <i className={`fa-solid ${item.icone_classe || 'fa-circle-exclamation'} ${styles.fireIconRed}`}></i>
                                
                                <div className={styles.recentInfo}>
                                    <h4>{item.tipo_ocorrencia}</h4>
                                    <p>{item.localizacao || 'Local não informado'}</p>
                                    
                                    {/* Data Formatada */}
                                    <p style={{fontSize: '0.75rem', color: '#999'}}>
                                        {item.data_hora 
                                            ? new Date(item.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + new Date(item.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                            : '--/--'
                                        }
                                    </p>
                                </div>

                                {/* Badge Colorida */}
                                <span className={`${styles.statusBadge} ${getBadgeClass(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div style={{padding: '30px', textAlign: 'center', color: '#999'}}>
                            <i className="fa-solid fa-check-double" style={{fontSize:'1.5rem', marginBottom:'10px'}}></i>
                            <p>Nenhuma ocorrência recente.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* 3. BAIXO: Equipes e Gráficos */}
        <section className={styles.bottomSection}>
            
            {/* Equipes Ativas (Esquerda) */}
            <div className={styles.sectionCard}>
                <div className={styles.cardTitle}>Equipes Ativas (Tempo Real)</div>
                <div className={styles.teamList}>
                    {mockTeams.map(team => (
                        <div key={team.id} className={styles.teamItem}>
                            <span className={styles.teamName}>{team.nome}</span>
                            <span className={styles.teamInfo}>
                                <i className="fa-solid fa-users" style={{marginRight:'5px'}}></i>
                                {team.detalhe}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coluna da Direita (Gráficos) */}
            <div className={styles.chartsColumn}>
                
                {/* Gráfico de Barras */}
                <div className={styles.sectionCard}>
                    <div className={styles.cardTitle}>Volume Semanal</div>
                    <div className={styles.chartContainer}>
                        {weeklyData.map((val, idx) => (
                            <div key={idx} className={styles.barRed} style={{height: `${val * 4}px`}} title={`Dia ${idx+1}: ${val}`}></div>
                        ))}
                    </div>
                </div>

                {/* Gráfico Donut (Tipos) */}
                <div className={styles.sectionCard}>
                    <div className={styles.cardTitle}>Tipos de Ocorrências</div>
                    <div className={styles.donutChart}>
                        <div className={styles.donutHole}></div>
                    </div>
                    <div style={{textAlign:'center', marginTop:'15px', fontSize:'0.8rem', color:'#666'}}>
                        <strong>65%</strong> Incêndios / <strong>35%</strong> Outros
                    </div>
                </div>

            </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;