import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={closeSidebar} className="close-sidebar">X</button>
      <ul className="sidebar-items">
        <li><Link to="/profile" onClick={closeSidebar}>Perfil</Link></li>
        <li><Link to="/search-tutors" onClick={closeSidebar}>Buscar Tutores</Link></li>
        <li><Link to="/calendar" onClick={closeSidebar}>Calendario</Link></li>
        <li><Link to="/session-history" onClick={closeSidebar}>Historial sesiones</Link></li>
        <li><Link to="/chat" onClick={closeSidebar}>Chat</Link></li>
        <li><Link to="/logout" onClick={closeSidebar}>Cerrar sesión</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
