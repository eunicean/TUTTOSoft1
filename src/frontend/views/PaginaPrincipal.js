import React from 'react';
import HeaderYmenu from './components/HeaderYmenu.js';

const PaginaPrincipal = () => {
  return (
    <div>
      <HeaderYmenu />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#C19A6B' }}>Sesiones Próximas</h2>
        <select style={{ marginBottom: '10px', padding: '5px', borderRadius: '5px', backgroundColor: '#C19A6B', color: 'white' }}>
          <option value="manana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>
        <br />
        <button style={{ backgroundColor: '#C04000', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Ir al Chat</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ backgroundColor: '#C19A6B', color: 'white', padding: '20px', borderRadius: '10px', maxWidth: '300px', margin: '0 10px' }}>
          <h3>Tutoría de Matemáticas</h3>
          <p>Mañana a las 10:00 AM</p>
          <p>Tutor: Juan Pérez</p>
        </div>
        <div style={{ backgroundColor: '#C19A6B', color: 'white', padding: '20px', borderRadius: '10px', maxWidth: '300px', margin: '0 10px' }}>
          <h3>Tutoría de Física</h3>
          <p>Tarde a las 3:00 PM</p>
          <p>Tutor: María García</p>
        </div>
        <div style={{ backgroundColor: '#C19A6B', color: 'white', padding: '20px', borderRadius: '10px', maxWidth: '300px', margin: '0 10px' }}>
          <h3>Tutoría de Historia</h3>
          <p>Noche a las 8:00 PM</p>
          <p>Tutor: Carlos López</p>
        </div>
      </div>
    </div>
  );
}

export default PaginaPrincipal;
