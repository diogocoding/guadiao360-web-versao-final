// components/Sidebar/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import styles from './sidebar.module.css';
import '../../styles/global.css'; // Importa estilos globais, se necessário

const navItems = [
  { to: '/', icon: 'fa-house', label: 'Ocorrências' },
  { to: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
  { to: '/relatorios', icon: 'fa-file-lines', label: 'Relatórios' },
  { to: '/usuarios', icon: 'fa-users', label: 'Usuários' },
  { to: '/auditoria', icon: 'fa-magnifying-glass', label: 'Auditoria' },
  { to: '/ajustes', icon: 'fa-gear', label: 'Ajustes' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img
          src="https://i.postimg.cc/28YgB6z9/Gemini-Generated-Image-tr1uhatr1uhatr1u-8.png"
          alt="Logo"
          className={styles.logo}
        />
      </div>
      <nav className={styles.sidebarNav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={location.pathname === item.to ? styles.active : ''}
              >
                <i className={`fa-solid ${item.icon}`}></i> <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.sidebarFooter}>
        <Link to="/login">
          <i className="fa-solid fa-right-from-bracket"></i> <span>Sair</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;