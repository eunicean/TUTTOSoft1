import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';
import { useNavigate } from 'react-router-dom'; 
import HistoryCard from '../components/HistoryCard.js'; // Importa el componente
import '../css/Sidebar.css';
import '../css/Navbar.css';
import '../css/Historial.css';

function SessionsHistory(){
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchSessionsHistory = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const baseUrl = process.env.REACT_APP_API_URL || '';

        const url = new URL(`${baseUrl}/api/session-history`);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const data = await response.json();
                if (data.success) {
                    const transformedSessions = data.sessions.map((session) => ({
                        id: session.id,
                        date: new Date(session.date).toLocaleDateString('es-ES'),
                        startHour: session.start_hour,
                        endHour: session.end_hour,
                        subject: `Curso: ${session.course_code}`,
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

    useEffect(() => {
        fetchSessionsHistory();
    }, []);

    const handleSessionClick = (sessionId, session) => {
        console.log("Click detected:", sessionId, session); // Verifica si el clic es detectado
        navigate(`/SessionVistaEstudiante/${sessionId}`, { state: session });
        console.log("Click");
    };

    return (
        <>
            <h1 className="page-title">Historial de Sesiones</h1>
            <div className="history-container">
                {sessions.length > 0 ? (
                    <table className="session-table">
                        <thead>
                            <tr>
                                <th>Curso</th>
                                <th>Fecha</th>
                                <th>Horario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(session => (
                                <HistoryCard 
                                    key={session.id} 
                                    date={session.date} 
                                    startHour={session.startHour} 
                                    endHour={session.endHour} 
                                    subject={session.subject} 
                                    onClick={() => handleSessionClick(session.id, session)} 
                                />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-session">No hay sesiones disponibles.</div>
                )}
            </div>
        </>
    );
}

export default SessionsHistory;