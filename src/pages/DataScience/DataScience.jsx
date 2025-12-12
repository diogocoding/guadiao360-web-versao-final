// src/pages/DataScience/DataScience.jsx
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainHeader from '../../components/Header/MainHeader';
// import styles from './DataScience.module.css'; // We'll create this or use global styles
import '../../styles/global.css';

const DataScience = () => {
    return (
        <div className="dashboardContainer">
            <Sidebar />
            <main className="mainContent grayBackground">
                <MainHeader
                    title="Análise de Dados"
                    actions={<></>}
                />

                <div style={{
                    height: 'calc(100vh - 100px)',
                    marginTop: '20px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <iframe
                        src="https://pidatasciencegit-wqjhy8mcvsya6rdzvh3b9n.streamlit.app/?embed=true"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 'none' }}
                        title="Streamlit Data Science Dashboard"
                    ></iframe>
                </div>
            </main>
        </div>
    );
};

export default DataScience;
