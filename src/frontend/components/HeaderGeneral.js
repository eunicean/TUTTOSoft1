const React = require('react');
const { Link } = require('react-router-dom');


const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9c4922',
    color: '#fff',
    padding: isSidebarOpen ? '0 70px' : '0 20px', // Ajusta el padding según el estado del Sidebar
    transition: 'padding 0.3s ease, height 0.3s ease',
    height: isSidebarOpen ? '80px' : '60px', // Ajusta la altura según el estado del Sidebar
  };

  const menuButtonStyle = {
    position: 'absolute',
    left: '10px',
    top: '1px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
  };

  const titleStyle = {
    margin: 0,
    fontSize: '24px',
    textAlign: 'center',
    width: '100%',
    color: '#fff',
  };

  return (
    <header style={headerStyle}>
      <button style={menuButtonStyle} onClick={toggleSidebar}>
        ☰
      </button>
      <Link to='/sessions' className ={titleStyle} style={{textDecoration: 'none'}}>
      <h1 style={titleStyle}>SISTEMA TUTO</h1>
      </Link>
    </header>
  );
};

export default Header;