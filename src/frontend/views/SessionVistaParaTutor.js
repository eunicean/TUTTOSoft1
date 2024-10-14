// src/Vista para verlo desde el punto de vista de tutor, donde sale informacion del
// estudiante a quien le este dando clases...

import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/SessionVistaParaTutor.css'
import Header from '../components/HeaderYmenu.js';
import StarRating from '../components/stars.js';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';

const SessionVistaParaTutorOEstudiante = () => {
    
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTutor, setIsTutor] = useState(false); // Nueva variable para verificar si es tutor o estudiante
    const navigate = useNavigate();
    const valorEstrellas = 3; // de la calificación en la base de datos

    // Funciones de navegación
    const goRating = (id) => {
        navigate(`/rate-tutor/${id}`);
    };

    const goReportAbsence = (id) => {
        navigate(`/absence/${id}`);
    };


    useEffect(() => {
        const fetchSession = async () => {
            const token = localStorage.getItem('token');
            const url = `http://localhost:5000/sessions/${sessionId}`;

            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    setSession(data.session);
                    setIsTutor(data.role === 'tutor'); // Usamos la respuesta de la API para determinar el rol del usuario
                } else {
                    setError(data.message || 'No session found');
                }
            } catch (error) {
                setError(`Failed to fetch session: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [sessionId]);

    const formatHour = (hourString) => {
      const [hour, minute] = hourString.split(':');
      const hourInt = parseInt(hour, 10);
      const suffix = hourInt >= 12 ? 'pm' : 'am';
      const formattedHour = hourInt % 12 || 12;  // Para manejar el caso de 12:00 pm o 12:00 am
      return `${formattedHour}:${minute} ${suffix}`;
  }


    if (loading) {
        return <p>Loading...</p>; // Mostrar mientras se carga la data
    }

    if (error) {
        return <p>Error: {error}</p>; // Mostrar errores
    }

  return (
        <div className="vista-container">
            <div className="header1">
                <span className="session-text">Sesión</span>
                <button className="cancel-button" onClick={() => navigate(`/cancel-session/${sessionId}`)}>Cancelar Cita</button>
            </div>
            
            <div className="content">
                <div className="card1">
                    <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
                    <h3>Nombre:  {session.studentName}</h3>
                    <p>Año: 3</p>
                    <p>Carnet: 123456</p> 
                    <StarRating rating={valorEstrellas} />
                    <button> Chat </button>
                </div>

                <div className="info">
                    <div className='TitulosInfo'>
                    <h2>Materia: {session.namecourse}</h2>
                    <h2>Hora: {formatHour(session.startHour)} a {formatHour(session.endHour)}</h2>
                </div>

                <hr className="divider" /> {/* Linea divisoria  */}
                
                <div className='Info2'>
                    <div className='temas'>
                        <h2> Notas para la sesion </h2>
                        <div className='temas-card1'>
                        <h2>  Temas a repasar: </h2>
                        <ul> 
                        {session.tutorNotes && session.tutorNotes.map((notes, index) => (
                            <li key={index}>{notes}</li>
                            ))}
                        </ul>
                    </div>
                        <div className='Btn-acciones-vista'>
                        <button onClick={() => goRating(sessionId)}>
                            Calificar sesión
                        </button>
                        
                        <button onClick={() => goReportAbsence(sessionId)}>
                            Reportar ausencia sesión
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default SessionVistaParaTutorOEstudiante;
