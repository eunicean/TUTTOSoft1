import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  
  const handleCancelSession = () => {
    // Lógica para cancelar sesión
    console.log('Sesión cancelada');
    closeSidebar();
  };

  const handleReportAbsence = () => {
    // Lógica para reportar ausencia
    console.log('Ausencia reportada');
    closeSidebar();
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
    window.location.href = '/login'; // Redirigir al usuario a la página de inicio de sesión
    closeSidebar();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={closeSidebar} className="close-sidebar">X</button>
      <button><img src="/icon.png" alt="icon" /></button>
      <ul className="sidebar-items">
        <li><Link to="/profile" onClick={closeSidebar}>Perfil</Link></li>
        <li><Link to="/seachtutor" onClick={closeSidebar}>Buscar Tutores</Link></li>
        <li><Link to="/calendar" onClick={closeSidebar}>Calendario</Link></li>
        <li><Link to="/sessions-history" onClick={closeSidebar}>Historial sesiones</Link></li>
        <li><Link to="/chat" onClick={closeSidebar}>Chat</Link></li>
        <li><Link to="/cancel-session/:sessionId" onClick={closeSidebar}>Cancelar Sesión</Link></li>
        <li><Link to="/absence" onClick={closeSidebar}>Reportar Ausencia</Link></li>
        <li><Link to="/tutorprofile" onClick={closeSidebar}>Sesión tutor</Link></li>
        <li><Link onClick={handleLogout}>Cerrar Sesión</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar; 
