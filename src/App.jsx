// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes Reutilizáveis (Header/Sidebar)
// Sidebar só é necessário se for usado como um componente de layout aqui, o que não é o caso.
// Você pode remover a linha "import Sidebar..." se não estiver sendo usada.
// import Sidebar from './components/Sidebar/Sidebar'; 

// IMPORTAÇÕES DOS COMPONENTES DE PÁGINA FINAIS
import Ajustes from './pages/Ajustes/Ajustes';
import Dashboard from './pages/Dashboard/Dashboard';
import Usuarios from './pages/Usuarios/Usuarios';
import Relatorios from './pages/Relatorios/Relatorios';
import DetalhesOcorrencia from './pages/DetalhesOcorrencia/DetalhesOcorrencia';

// ATENÇÃO: Essas importações substituem as declarações 'const' anteriores
import Ocorrencias from './pages/Ocorrencias/Ocorrencias'; 
import Auditoria from './pages/Auditoria/Auditoria';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota base: Lista de Ocorrências (Componente final) */}
        <Route path="/" element={<Ocorrencias />} />
        
        {/* Rotas secundárias do menu */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/usuarios" element={<Usuarios />} />
        {/* Rota de Auditoria (Componente final) */}
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/ajustes" element={<Ajustes />} />

        {/* Rotas de Ocorrência */}
        <Route path="/ocorrencia/:id" element={<DetalhesOcorrencia />} />
        <Route path="/ocorrencia/:id/editar" element={<h1>Página de Edição (Em Breve)</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;