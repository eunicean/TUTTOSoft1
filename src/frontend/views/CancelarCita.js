const React = require('react');
// import '../css/CancelarCita.css'; // Asegúrate de crear un archivo CSS para los estilos
require('../css/CancelarCita.css');

const CancelarCita = () => {
  return (
    <div className="cancelar-cita">
      <header className="header">
        <h1>Cancelar cita</h1>
        <button className="submit-button">Enviar</button>
      </header>
      <div className="content">
        <div className="reason">
          <label htmlFor="reason">Motivo</label>
          <textarea
            id="reason"
            placeholder="Escriba aquí otras cosas que le gustaría decir"
          />
        </div>
        <div className="tutor-info">
          <div className="tutor-photo"></div>
          <div className="tutor-details">
            <p>Nombre de Tutor</p>
            <p>5to año</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelarCita;
