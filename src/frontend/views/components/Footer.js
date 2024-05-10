import React from 'react';

function Footer() {
  const footerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    color: 'black',
    padding: '10px 0',
    textAlign: 'center'
  };

  return (
    <footer style={footerStyle}>
      <div className='footer-content'>
        <p>2024 Tuto. Servicios de Tutorías.</p>
      </div>
    </footer>
  );
}

export default Footer;
