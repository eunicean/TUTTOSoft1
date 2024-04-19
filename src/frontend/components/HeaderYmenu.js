import React, { useState } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div>
      <div style={headerStyle}>
        <button onClick={() => window.history.back()} className="back-button">
          Regresar
        </button>
        <button onClick={handleMenuToggle} className="menu-button">
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
