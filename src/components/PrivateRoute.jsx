import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Verifica se existe o usuário salvo no localStorage (criado no Login.jsx)
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Se não tiver usuário, chuta para o login
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;