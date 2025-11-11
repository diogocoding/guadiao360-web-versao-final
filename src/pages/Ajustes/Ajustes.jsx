// pages/Ajustes/Ajustes.jsx
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './ajustes.module.css';
import '../../styles/global.css'; // Importação correta (global, sem atribuição)

const Ajustes = () => {
    return (
        <div className="dashboardContainer">
            <Sidebar />
            <main className={`mainContent grayBackground ${styles.mainContentOverride}`}>
                
                {/* H1 é escondido pelo CSS de ajustes, mas mantemos o contêiner principal do cartão */}
                <div className={styles.settingsCard}>
                    <div className={styles.cardTopBar}>
                        <img
                            src="https://i.postimg.cc/Cx23dpcK/retrato-de-um-bombeiro-em-frente-um-carro-de-bombeiros-1-1.png"
                            alt="Foto de Perfil"
                            className={styles.profilePicture}
                        />
                        <i className={`fa-solid fa-bell ${styles.notificationIconCard}`}></i>
                    </div>

                    <form className={styles.settingsGrid}>
                        <div className={styles.profileDetails}>
                            <div className={styles.formGroup}>
                                <label htmlFor="nome-completo">Nome Completo</label>
                                <input
                                    type="text"
                                    id="nome-completo"
                                    defaultValue="Cleiton Bombeiro"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" defaultValue="seu.email@cbm.com.br" />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="telefone">Telefone</label>
                                <input type="tel" id="telefone" defaultValue="(XX) XXXXX-XXXX" />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="matricula">Matrícula</label>
                                <input type="text" id="matricula" placeholder="Chave API" />
                            </div>
                        </div>

                        <div className={styles.passwordSecurity}>
                            <div className={styles.formGroup}>
                                <label htmlFor="senha-atual">Senha Atual</label>
                                <div className={styles.passwordWrapper}>
                                    <input type="password" id="senha-atual" defaultValue="••••••••" />
                                    <i className="fa-solid fa-eye-slash"></i>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="nova-senha">Nova Senha</label>
                                <input type="password" id="nova-senha" />
                            </div>

                            <button type="button" className={`${styles.btnForm} ${styles.btnConfirmPass}`}>
                                Confirmar Nova Senha
                            </button>

                            <div className={styles.toggleSwitch}>
                                <span>Notificações por Email</span>
                                <label className={styles.switch}>
                                    <input type="checkbox" defaultChecked />
                                    <span className={`${styles.slider} ${styles.round}`}></span>
                                </label>
                            </div>

                            <button type="submit" className={`${styles.btnForm} ${styles.btnSaveChanges}`}>
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Ajustes;