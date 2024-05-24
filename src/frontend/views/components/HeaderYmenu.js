import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom'; 

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTransition, setMenuTransition] = useState('transform 0.3s ease');
  const [headerTransition, setHeaderTransition] = useState('width 0.3s ease');

  useEffect(() => {
    // Sincronizar las duraciones de las transiciones del Header y el menú
    setMenuTransition(menuOpen ? 'transform 0.3s ease 0.3s' : 'transform 0.3s ease');
    setHeaderTransition(menuOpen ? 'width 0.3s ease 0.3s' : 'width 0.3s ease');
  }, [menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const headerStyle = {
    display: 'flex',
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#C19A6B',
    height: '10vh',
    color: 'white',
    transition: headerTransition,
    width: menuOpen ? 'calc(100% - 15%)' : 'auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflowX: 'hidden',
    margin: '0'
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
  }

  return (
    <div style={{ overflowX: 'hidden', overflowY: 'hidden', width: '100%', padding:0, margin: 0}}>
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
        <a href="/pagina1" style={optionStyle}>Perfil</a>
        <a href="/pagina2" style={optionStyle}>Buscar tutores</a>
        <a href="/pagina3" style={optionStyle}>Calendario</a>
        <a href="/pagina4" style={optionStyle}>Historia sesiones</a>
        <a href="/pagina5" style={optionStyle}>Chat</a>
        <a href="/pagina6" style={optionStyle}>Cerrar mi sesión</a>
      </div>
    </div>
  );
}

export default Header;