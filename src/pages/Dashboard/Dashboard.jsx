// pages/Dashboard/Dashboard.jsx
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainHeader from '../../components/Header/MainHeader';
import styles from './dashboard.module.css'; // Importa os estilos modulares locais
import '../../styles/global.css'; // Importa estilos de layout global

// Dados mockados (baseado no dashboard-operacional.html)
const chartData = [
    { bars: [ { color: 'barRed', height: 150 }, { color: 'barBlue', height: 100 } ] },
    { bars: [ { color: 'barRed', height: 120 }, { color: 'barGreen', height: 200 }, { color: 'barBlue', height: 250 } ] },
    { bars: [ { color: 'barRed', height: 160 }, { color: 'barBlue', height: 140 } ] },
    { bars: [ { color: 'barRed', height: 90 }, { color: 'barBlue', height: 120 } ] },
];

const Dashboard = () => {
  return (
    // Classes de layout globais
    <div className="dashboardContainer">
      <Sidebar />
      {/* Classe global 'mainContent' + classe local 'mainContentOverride' para o fundo cinza */}
      <main className={`mainContent ${styles.mainContentOverride}`}>
        
        <MainHeader 
          title="Dashboard Operacional"
          actions={<></>} // O HTML não define ações no header
        />

        {/* Container do Gráfico (Estilos do Modulo) */}
        <section className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Ocorrências por mês</h3>

          <div className={styles.chartPlaceholder}>
            {/* Mapeando os dados do gráfico */}
            {chartData.map((group, groupIndex) => (
              <div key={groupIndex} className={styles.barGroup}>
                {group.bars.map((bar, barIndex) => (
                  <div
                    key={barIndex}
                    // Aplica a classe .bar e a classe de cor (.barRed, .barGreen, .barBlue)
                    className={`${styles.bar} ${styles[bar.color]}`}
                    style={{ height: `${bar.height}px` }}
                    title={`Valor: ${bar.height}`} // Adicionado para acessibilidade
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;