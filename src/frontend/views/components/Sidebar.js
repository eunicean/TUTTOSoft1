import React from 'react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={closeSidebar} className="close-sidebar">X</button>
      <ul className="sidebar-items">
        <li>Perfil</li>
        <li>Buscar Tutores</li>
        <li>Calendario</li>
        <li>Historial sesiones</li>
        <li>Chat</li>
        <li>Cerrar sesión</li>
      </ul>
    </div>
  );
};
export default Sidebar;
