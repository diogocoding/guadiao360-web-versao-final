// Configuração da API
export const getApiBaseUrl = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  // Substitui a porta do frontend (5173/5174) pela porta do backend (3001)
  return `${protocol}//${hostname}:3001`;
};

export const API_BASE_URL = getApiBaseUrl();
