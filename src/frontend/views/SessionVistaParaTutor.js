// src/Vista.js
import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/TutorProfile.css'
import Header from '../components/HeaderYmenu.js';
import StarRating from '../components/stars.js';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';

const SessionVistaParaTutor = () => {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    // de la calificacion en la bae de datos...
    const valorEstrellas = 3;

    useEffect(() => {
        const fetchSession = async () => {
            const token = localStorage.getItem('token');
            const url = `http://localhost:5000/sessions/${sessionId}`; 
            // const url = `http://localhost:5000/session-info/${sessionId}`;   
            // no se cual de las dos es xd

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


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    if (loading) {
        return <p>Loading...</p>; // Display while data is loading
    }

    if (error) {
        return <p>Error: {error}</p>; // Display errors
    }

  return (
    <div className="vista-container">
    <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
    <Navbar />
      <div className="header">
      <button className="menu-toggle" onClick={toggleSidebar}>Menu</button>
        <span className="session-text">Sesión</span>
        <button className="cancel-button" onClick={() => navigate(`/cancel-session/${sessionId}`)}>Cancelar Cita</button>
      </div>
      <div className="content">
        <div className="card">
          <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
          <h3>Nombre:  {session.studentName}</h3>
          <p>Año: 3</p>
          <p>Carnet: 123456</p> 
          <StarRating rating={valorEstrellas} />
          <button> Cerrar Sesion </button>
        </div>

        <div className="info">
        <div className='TitulosInfo'>
          <h2>Materia: {session.CourseCode}</h2>
          <h2> Inicio: {session.startHour}</h2> <h2> Finalización: {session.endHour}</h2>

        </div>
          <div className='Info2'>

            <div className='temas'>
                <h2> Notas para la sesion </h2>
                <div className='temas-card'>
                <h2>Temas a repasar</h2>
                <ul> 
                {session.temas && session.temas.map((tema, index) => (
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

export default SessionVistaParaTutor;