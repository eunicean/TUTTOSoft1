// src/Vista para verlo desde el punto de vista de tutor o estudiante...
import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/TutorProfile.css';
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

    if (loading) {
        return <p>Loading...</p>; // Mostrar mientras se carga la data
    }

    if (error) {
        return <p>Error: {error}</p>; // Mostrar errores
    }

    return (
        <div className="vista-container">
            <div className="header">
                <span className="session-text">Sesión</span>
                {/* Botón para cancelar la cita */}
                <button className="cancel-button" onClick={() => navigate(`/cancel-session/${sessionId}`)}>Cancelar Cita</button>
            </div>
            <div className="content">
                <div className="card1">
                    <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
                    
                    {/* Verificar si el rol es de tutor o estudiante y mostrar los detalles correspondientes */}
                    {isTutor ? (
                        // Si es tutor, mostramos los detalles del estudiante
                        <>
                            <h3>Nombre del Estudiante: {session.studentName}</h3>
                            <p>Año: {session.studentYear}</p>
                            <p>Carnet: {session.studentCarnet}</p> 
                            <button>Chat con Estudiante</button>
                        </>
                    ) : (
                        // Si es estudiante, mostramos los detalles del tutor
                        <>
                            <h3>Nombre del Tutor: {session.tutorName}</h3>
                            <p>Especialidad: {session.tutorSpecialty}</p>
                            <StarRating rating={valorEstrellas} />
                            <button>Chat con Tutor</button>
                        </>
                    )}
                </div>

                <div className="info">
                    <div className="TitulosInfo">
                        <h2>Materia: {session.CourseCode}</h2>
                        <h2>Inicio: {session.startHour}</h2> 
                        <h2>Finalización: {session.endHour}</h2>
                    </div>
                    <div className="Info2">
                        <div className="temas">
                            <h2>Notas para la sesión</h2>
                            <div className="temas-card1">
                                <h2>Temas a repasar</h2>
                                <ul> 
                                    {session.temas && session.temas.map((tema, index) => (
                                        <li key={index}>{tema}</li>
                                    ))}
                                </ul>
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
};

export default SessionVistaParaTutorOEstudiante;
