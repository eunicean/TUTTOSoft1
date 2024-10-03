const React = require('react');
const { useState, useEffect } = React;
require('../css/TutorProfile.css');
const StarRating = require('../components/stars.js');

const TutorProfile = () => {
  const [temas, setTemas] = useState([]);

  useEffect(() => {
      const obtenerTemas = async () => {
         const  temasList = ['matematica', 'Lenguaje', 'Ciencias'];
        setTemas(temasList);
      };
      obtenerTemas(); 
    }, []);

    // donde se tiene que mandar a traer un valor en la base de datos
    // de la calificacion en la bae de datos...
    const valorEstrellas = 3;
return (
  <div className="vista-container">
      
    <div className="header">
      <span className="session-text">Sesión</span>
      <button className="cancel-button">Cancelar Cita</button>
    </div>
    <div className="content">
      <div className="card">
        <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
        <h3>Nombre: Juan Pérez</h3>
        <p>Año: 3</p>
        <p>Carnet: 123456</p> 
        <StarRating rating={valorEstrellas} />
        <button> CHAT </button>
      </div>

      <div className="info">
      <div className='TitulosInfo'>
        <h2>Materia: Matemática Aplicada</h2>
        <h3>Hora: 10:00 AM</h3>
      </div>
        <div className='Info2'>

          <div className='temas'>
              <h2> Notas para la sesion </h2>
              <div className='temas-card'>
              <h2>Temas a repasar</h2>
              <ul>
                {temas.map((tema, index) => (
                  <li key={index}>{tema}</li>
                ))}
              </ul>
              <button>Calificar sesion</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default TutorProfile;