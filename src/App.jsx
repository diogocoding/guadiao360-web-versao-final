import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importação do componente de proteção de rota
import PrivateRoute from './components/PrivateRoute';

// Importação das Páginas e Componentes
import Login from './components/Login/Login';
import Ocorrencias from './pages/Ocorrencias/Ocorrencias';
import Dashboard from './pages/Dashboard/Dashboard';
import Relatorios from './pages/Relatorios/Relatorios';
import Usuarios from './pages/Usuarios/Usuarios';
import Auditoria from './pages/Auditoria/Auditoria';
import Ajustes from './pages/Ajustes/Ajustes';
import DetalhesOcorrencia from './pages/DetalhesOcorrencia/DetalhesOcorrencia';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ROTAS PÚBLICAS --- */}
        <Route path="/login" element={<Login />} />

        {/* --- ROTAS PROTEGIDAS (Exigem Login) --- */}
        
        {/* Rota Raiz (Home) - Lista de Ocorrências */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Ocorrencias />
            </PrivateRoute>
          } 
        />

        {/* Dashboard Operacional */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Relatórios Analíticos */}
        <Route 
          path="/relatorios" 
          element={
            <PrivateRoute>
              <Relatorios />
            </PrivateRoute>
          } 
        />

        {/* Gestão de Usuários */}
        <Route 
          path="/usuarios" 
          element={
            <PrivateRoute>
              <Usuarios />
            </PrivateRoute>
          } 
        />

        {/* Auditoria e Logs */}
        <Route 
          path="/auditoria" 
          element={
            <PrivateRoute>
              <Auditoria />
            </PrivateRoute>
          } 
        />

        {/* Configurações / Ajustes */}
        <Route 
          path="/ajustes" 
          element={
            <PrivateRoute>
              <Ajustes />
            </PrivateRoute>
          } 
        />

        {/* Detalhes da Ocorrência (Rota Dinâmica com ID) */}
        <Route 
          path="/ocorrencia/:id" 
          element={
            <PrivateRoute>
              <DetalhesOcorrencia />
            </PrivateRoute>
          } 
        />

        {/* Rota para qualquer URL desconhecida (Redireciona para home ou login) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;