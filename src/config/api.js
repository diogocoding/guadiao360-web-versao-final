// src/config/api.js (CÓDIGO CORRIGIDO)

// Para projetos Vite, a variável de ambiente configurada no Netlify é lida
// através de import.meta.env.VITE_NOME_DA_VARIAVEL
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getApiBaseUrl = () => {
    // 1. Prioriza a variável de ambiente (URL do Render) se ela existir (i.e., em produção)
    if (VITE_API_BASE_URL) {
        return VITE_API_BASE_URL;
    }

    // 2. Se a variável não existir (i.e., ambiente local de desenvolvimento sem .env), 
    // retorna a URL de desenvolvimento local
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    // Assume que a API local está em http://localhost:3001
    return `${protocol}//${hostname}:3001`; 
};

export const API_BASE_URL = getApiBaseUrl();

// (Se você estiver usando axios, certifique-se de configurar o axios.defaults.baseURL aqui se for o caso)
