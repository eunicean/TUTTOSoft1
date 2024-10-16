import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/SessionVistaParaTutor.css';
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

    useEffect(() => {
        const fetchSession = async () => {
            const token = localStorage.getItem('token');
            const url = `https://209.126.125.63/api/sessions/${sessionId}`;

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
        const formattedHour = (hourInt % 12) || 12;  // Para manejar el caso de 12:00 pm o 12:00 am
        return `${formattedHour}:${minute} ${suffix}`;
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="vista-container">
            <Header />
            <Sidebar />
            <Navbar />
            <div className="header1">
                <span className="session-text">Sesión</span>
                <button className="cancel-button" onClick={() => navigate(`/cancel-session/${sessionId}`)}>Cancelar Cita</button>
            </div>
            <div className="content">
                <div className="card1">
                    <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
                    <h3>Nombre: {session ? session.studentName : 'Nombre no disponible'}</h3>
                    <p>Año: 3</p>
                    <p>Carnet: {session ? session.studentCarnet : 'Carnet no disponible'}</p>
                    <StarRating rating={valorEstrellas} />
                    <button>Chat</button>
                </div>
                <div className="info">
                    <div className='TitulosInfo'>
                        <h2>Materia: {session ? session.namecourse : 'Curso no disponible'}</h2>
                        <h2>Hora: {session ? `${formatHour(session.startHour)} a ${formatHour(session.endHour)}` : 'Horario no disponible'}</h2>
                    </div>
                    <hr className="divider" />
                    <div className='Info2'>
                        <div className='temas'>
                            <h2> Notas para la sesión </h2>
                            <div className='temas-card1'>
                                <h2> Temas a repasar: </h2>
                                <ul>
                                    {session && session.tutorNotes && session.tutorNotes.map((note, index) => (
                                        <li key={index}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className='Btn-acciones-vista'>
                                <button> Calificar Sesión </button>
                                <button> Reportar Ausencia </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionVistaParaTutorOEstudiante;
