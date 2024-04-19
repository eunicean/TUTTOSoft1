import React, { useState } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  
  const headerStyle = {
    display: 'flex',
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#333',
    color: 'white',
    padding: '10px',
    transition: 'width 0.3s ease', // Agregamos una transición para suavizar la animación
    width: menuOpen ? 'calc(100% - 300px)' : '100%', // Reducimos el ancho del Header cuando el menú está abierto
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const menuStyle = { 
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '300px',
    backgroundColor: '#333',
    color: 'white',
    padding: '10px',
    borderRadius: '0 5px 5px 0',
    overflowY: 'auto',
    transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
  };
  const menuButton = {
        marginLeft: 'auto', // Alinea el botón de menú a la derecha del Header
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        cursor: 'pointer',  
  }; 

  return (
    <div>
      <div style={headerStyle}>
        <button onClick={() => window.history.back()} className="back-button">
          Regresar
        </button>
        <button onClick={handleMenuToggle} className="menu-button" style={menuButton}>
          {menuOpen ? 'Cerrar Menú' : 'Abrir Menú'}
        </button>
      </div>
      <div style={menuStyle}>
        <ul>
          <li>Opción 1</li>
          <li>Opción 2</li>
          <li>Opción 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Header;