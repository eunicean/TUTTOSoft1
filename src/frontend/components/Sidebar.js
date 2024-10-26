import React from 'react';
import { Link} from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  // const handleCancelSession = () => {
  //   // Lógica para cancelar sesión
  //   console.log('Sesión cancelada');
  //   closeSidebar();
  // };

  // const handleReportAbsence = () => {
  //   // Lógica para reportar ausencia
  //   console.log('Ausencia reportada');
  //   closeSidebar();
  // };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
    window.location.href = '/login'; // Redirigir al usuario a la página de inicio de sesión
    closeSidebar();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <button onClick={closeSidebar} className="close-sidebar">X</button>
         <div className="sidebar-header">
        <Link to="/sessions" onClick={closeSidebar} className="icon-button">
          <img src="/icon.png" alt="icon" className="sidebar-top-icon" />
        </Link>
      </div>
      <ul className="sidebar-items">
        <li>
          <Link to="/profile" onClick={closeSidebar} className="sidebar-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clip-rule="evenodd"/></svg>
            Perfil
          </Link>
        </li>
        <li>
          <Link to="/seachtutor" onClick={closeSidebar} className="sidebar-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="currentColor" d="M10.68 11.74a6 6 0 0 1-7.922-8.982a6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275a.75.75 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7"/></svg>
            Buscar Tutores
          </Link>
        </li>
        <li>
          <Link to="/sessions-history" onClick={closeSidebar} className="sidebar-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89l.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.95 8.95 0 0 0 13 21a9 9 0 0 0 0-18m-1 5v5l4.28 2.54l.72-1.21l-3.5-2.08V8z"/></svg>
            Historial sesiones
          </Link>
        </li>
        <li>
          <Link to="/chat" onClick={closeSidebar} className="sidebar-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M10 3h4a8 8 0 1 1 0 16v3.5c-5-2-12-5-12-11.5a8 8 0 0 1 8-8"/></svg>
            Chat
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="sidebar-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 4.001H5v14a2 2 0 0 0 2 2h8m1-5l3-3m0 0l-3-3m3 3H9"/></svg>
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar; 