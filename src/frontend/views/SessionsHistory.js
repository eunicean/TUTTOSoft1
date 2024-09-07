import React, { useState, useEffect } from 'react';
import HistoryCard from '../components/HistoryCard.js';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';
import { useNavigate } from 'react-router-dom'; 
import '../css/Sidebar.css';
import '../css/Navbar.css';
import '../css/Historial.css'



function SessionsHistory(){
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodo, setPeriodo] = useState('');
    const [user, setUser] = useState({});
    const [isSidebarOpen,  setIsSidebarOpen] = useState(false);
    const navigate = useNavigate

    const fetchSessionsHistory = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const url = new URL('http://localhost:5000/session-history'); // Cambiado a la URL correcta
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
    
                    const transformedSessions = data.sessions.map((session) => ({
                        id: session.id,
                        date: new Date(session.date).toLocaleDateString('es-ES'),
                        startHour: session.start_hour,
                        endHour: session.end_hour,
                        subject: `Curso: ${session.course_code}`,
                        mode: session.mode
                    }));
    
                    setSessions(transformedSessions);
                } else {
                    throw new Error(data.message || 'Failed to fetch profile');
                }
            } else {
                throw new Error('Unexpected content type');
            }
        } catch (error) {
            console.error("Could not fetch any sessions: ", error);
            setError(`Failed to fetch sessions: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

       // Fetch session history when the component mounts
       useEffect(() => {
        fetchSessionsHistory();
    }, []);
    
    const handleSessionClick = (sessionId, session) => {
        navigate(`/SessionVistaEstudiante/${sessionId}`, { state: session });
    };

    return(
        <>
        <h1 className="page-title">Historial de Sesiones</h1>
    <div className='history-container'>
        <div className='si-sessions'>
            {sessions.length > 0 ? (
                sessions.map(session => (
                    <button key={session.id} onClick={() => handleSessionClick(session.id, session)} className="Card-button">
                        <HistoryCard
                            date={session.date}
                            startHour={session.startHour}
                            endHour={session.endHour}
                            subject={session.subject}
                            mode={session.mode}
                        />
                    </button>
                ))
            ) : (
                <div className="no-session">No hay sesiones disponibles.</div>
            )}
        </div>
    </div>
</>

    )
}

export default SessionsHistory;