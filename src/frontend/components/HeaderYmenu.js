import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir después de cerrar sesión


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTransition, setMenuTransition] = useState('transform 0.3s ease');
  const [headerTransition, setHeaderTransition] = useState('width 0.3s ease');
  const navigate = useNavigate();


  // Obtener el rol del usuario (typeuser) de localStorage
  const typeuser = parseInt(localStorage.getItem('typeuser'), 10);


  useEffect(() => {
    // Sincronizar las duraciones de las transiciones del Header y el menú
    setMenuTransition(menuOpen ? 'transform 0.3s ease 0.3s' : 'transform 0.3s ease');
    setHeaderTransition(menuOpen ? 'width 0.3s ease 0.3s' : 'width 0.3s ease');
  }, [menuOpen]);


  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('typeuser');
    navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
  };


  const headerStyle = {
    display: 'flex',
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#C19A6B',
    height: '5vh',
    color: 'white',
    transition: headerTransition,
    width: menuOpen ? 'calc(100% - 15%)' : 'auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflowX: 'hidden',
  };


  const menuStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '15%',
    backgroundColor: '#C04000',
    color: 'white',
    borderRadius: '0 5px 5px 0',
    overflowY: 'auto',
    transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: menuTransition,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };


  const menuButton = {
    marginLeft: 'auto',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  };
  const imageStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '20px',
  };


  const optionStyle = {
    marginBottom: '50px',
    textAlign: 'center',
  };


  const HomeButton = {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  };


  return (
    <div style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
      <div style={headerStyle}>
        <button onClick={() => window.history.back()} className="back-button" style={HomeButton}>
          Home
        </button>
        <button onClick={handleMenuToggle} className="menu-button" style={menuButton}>
          {menuOpen ? 'Cerrar Menú' : 'Abrir Menú'}
        </button>
      </div>
      <div style={menuStyle}>
        <img src="FPerfil.jpg" alt="Imagen" style={imageStyle} />
        <a href="/profile" style={optionStyle}>Perfil</a>


        {/* Opciones Condicionales según el Rol */}
        {typeuser === 3 ? (
          <>
            <a href="/adminsearch" style={optionStyle}>Cambiar Rol</a>
            <a href="/admintutor" style={optionStyle}>Buscar Tutor</a>
          </>
        ) : (
          <>
            <a href="/seachtutor" style={optionStyle}>Buscar Tutores</a>
            <a href="/calendar" style={optionStyle}>Calendario</a>
          </>
        )}


        <a href="/sessions-history" style={optionStyle}>Historia sesiones</a>
        <a href="/chat" style={optionStyle}>Chat</a>
       
        <button onClick={handleLogout} style={{ ...optionStyle, background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}


export default Header;