// src/Vista.js
import React, {useState, useEffect} from 'react';
import Header from './HeaderYMenu';
import './TutorProfile.css';

const TutorProfile = () => {
    const [file, setFile] = useState(null);
    const [temas, setTemas] = useState([]);

    // Subir un documento.
    const handleFileChange = (event) => {
        setFile(event.target.files[0]); 
    }; 
    const handleSubmit = (event) => {
        event.preventDefault();
        if (file) {
            // manejar la carga de archivos. O sea por la accion, para enviarlos hacia algun lugar. 
            console.log("archivo enviado correctamente", file.name); 
        }
    }

    useEffect(() => {
        const obtenerTemas = async () => {
           const  temasList = ['matematica', 'Lenguaje', 'Ciencias'];
          setTemas(temasList);
        };
        obtenerTemas(); // ejecutar la funcion
      }, []);

  return (
    <div className="vista-container">
        <Header></Header>
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
          <div className="card-buttons">
            <button>Botón 1</button>
            <button>Botón 2</button>
            <button>Botón 3</button>
          </div>
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
                    <li key={index}>{tema.nombre}</li>
                  ))}
                </ul>
                <button>Calificar la sesion</button>
                </div>
            </div>
            <div className='DocsEstudiante'>
                <h2>Documentos del estudiante</h2>
                <div className='UploadBoxFile'> 
                    <form onSubmit={handleSubmit}> 
                        <input type="file" onChange={handleFileChange} /> 
                        <button type='submit'> Subir archivo</button>
                    </form>
                    {file && <p>Archivo seleccionado: {file.name}</p>}
                </div>
                <button>Reportar ausencias</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;