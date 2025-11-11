// components/Header/MainHeader.jsx

import React from 'react';
import '../../styles/global.css'; 

const MainHeader = ({ title, actions }) => {
  return (
    <header className="mainHeader">
      <h1>{title}</h1>
      <div className="headerActions">
        {actions}
        <div className="userProfile">
          <i className="fa-solid fa-bell"></i>
          <span className="userGreet">Olá, Admin</span>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;