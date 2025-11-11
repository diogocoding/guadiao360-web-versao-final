// pages/DetalhesOcorrencia/DetalhesOcorrencia.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
// MainHeader não é usado aqui, pois o header é customizado
import styles from './detalhes.module.css'; // Importa os estilos modulares locais
import '../../styles/global.css'; // Importa estilos de layout global

// Dados mockados (baseado no detalhes-ocorrencia.html)
const mockOccurrence = {
    id: '#2023-1254',
    type: 'Incêndio Estrutural',
    status: 'Em Atendimento',
    zona: 'Central',
    prioridade: 'Alta',
    dataHora: '15/05/2023 10:30',
    solicitante: 'Maria Silva',
    endereco: 'Rua das Flores, 123, Santo Antônio',
    historico: [
        '10:32: Chamado recebido e registrado.',
        '11:45: Equipe despachada (VTR 123)',
        '12:00: Em rescaldo e avaliação.',
        '14:36: Incêndio Controlado',
    ],
    midias: [
        { type: 'image', name: 'foto_do_local.jpg', src: 'https://i.postimg.cc/sDmtrrp1/image-4.png' },
        { type: 'video', name: 'video_ocorrencia.mp4', src: 'https://i.postimg.cc/fbySMmkG/videodolocal.png' },
        { type: 'audio', name: 'chamada_193.mp3', icon: 'fa-file-audio', iconClass: styles.faFileAudio },
        { type: 'pdf', name: 'relatorio_inicial.pdf', icon: 'fa-file-pdf', iconClass: styles.faFilePdf },
    ],
};

const DetalhesOcorrencia = () => {
    const { id } = useParams(); // Hook para obter o ID da URL se necessário
    const occurrence = mockOccurrence; 

    return (
        // Classes de layout globais
        <div className="dashboardContainer">
            <Sidebar />
            {/* Classes globais 'mainContent' e 'grayBackground' (de global.css)
              e classe local 'mainContentOverride' (de detalhes.module.css) 
            */}
            <main className={`mainContent grayBackground ${styles.mainContentOverride}`}>
                
                {/* Header Customizado (baseado no HTML) */}
                <header className={`mainHeader ${styles.detailsHeader}`}>
                    <div className={styles.headerTitleGroup}>
                        <h1>Detalhes da Ocorrência</h1>
                        <h2 className={styles.occurrenceId}>{occurrence.id}</h2>
                    </div>
                    <div className="headerActions">
                        <button className="btn btnPrimary">
                            <i className="fa-solid fa-pen-to-square"></i> Atualizar Status
                        </button>
                        <div className="userProfile">
                            <i className="fa-solid fa-bell"></i>
                            <span className="userGreet">Olá, Admin</span>
                        </div>
                    </div>
                </header>

                {/* Grid Principal de Detalhes */}
                <div className={styles.detailsGrid}>
                    
                    {/* Coluna da Esquerda */}
                    <div className={styles.detailsColLeft}>
                        
                        {/* Card Info Principal */}
                        <div className={`${styles.infoCard} ${styles.infoPrincipal}`}>
                            <h3>Informações Principais</h3>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Tipo:</span>
                                    <span className={styles.infoValue}>{occurrence.type}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Status:</span>
                                    <span className={styles.infoValue}>
                                        <span className={`${styles.statusDot} ${styles.statusAtendimento}`}></span>
                                        {occurrence.status}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Zona:</span>
                                    <span className={styles.infoValue}>{occurrence.zona}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Prioridade:</span>
                                    <span className={styles.infoValue}>{occurrence.prioridade}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Data/Hora:</span>
                                    <span className={styles.infoValue}>{occurrence.dataHora}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Solicitante:</span>
                                    <span className={styles.infoValue}>{occurrence.solicitante}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Localização */}
                        <div className={`${styles.infoCard} ${styles.cardLocalizacao}`}>
                            <div className={styles.cardHeader}>
                                <h3>Localização</h3>
                                <i className={`fa-solid fa-arrows-rotate ${styles.refreshIcon}`}></i>
                            </div>
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.3603071803923!2d-34.88245778921003!3d-8.064681991929543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18b991a6d277%3A0xda5638ae78a7fbdc!2sR.%20das%20Fl%C3%B4res%20-%20Santo%20Ant%C3%B4nio%2C%20Recife%20-%20PE%2C%2052021-210!5e0!3m2!1sen!2sbr!4v1761126336330!5m2!1sen!2sbr" 
                                width="100%" 
                                height="400" /* Altura ajustada */
                                style={{ border:0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                            <p className={styles.address}>
                                {occurrence.endereco}
                            </p>
                            <button className={styles.btnSecondary}>
                                <i className="fa-solid fa-file-lines"></i> Gerar Relatório Parcial
                            </button>
                        </div>
                    </div>

                    {/* Coluna da Direita */}
                    <div className={styles.detailsColRight}>
                        
                        {/* Card Mídias */}
                        <div className={styles.infoCard}>
                            <h3>Mídias e Anexos</h3>
                            <div className={styles.mediaGrid}>
                                {occurrence.midias.map((media, index) => (
                                    <Link to="#" className={styles.mediaItem} key={index}>
                                        {media.type === 'image' || media.type === 'video' ? (
                                            <img src={media.src} alt={media.name} className={styles.mediaThumbnail} />
                                        ) : (
                                            <i className={`fa-solid ${media.icon} ${styles.mediaIcon} ${media.iconClass}`}></i>
                                        )}
                                        <span>{media.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Card Timeline */}
                        <div className={styles.infoCard}>
                            <h3>Timeline/Histórico de Ações</h3>
                            <ul className={styles.timelineList}>
                                {occurrence.historico.map((item, index) => {
                                    const parts = item.split(':');
                                    const time = parts[0];
                                    const action = parts.slice(1).join(':');
                                    return (
                                        <li key={index}>
                                            <strong>{time}:</strong>{action}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Ícone Flutuante (Voltar)*/}
                <Link to="/" className={styles.floatingActionIcon} title="Voltar para Ocorrências">
                    <i className="fa-solid fa-arrow-left"></i>
                </Link>
            </main>
        </div>
    );
};

export default DetalhesOcorrencia;