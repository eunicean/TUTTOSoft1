import React, { useState, useEffect } from 'react';
import SessionCard from '../components/Card.js';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';
import { useNavigate } from 'react-router-dom'; 
import '../css/Sessions.css';
import '../css/Sidebar.css';
import '../css/Navbar.css';

function Sessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodo, setPeriodo] = useState('');
    const [user, setUser] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem('token');
            const url = 'https://209.126.125.63/api/profile';

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                } else {
                    throw new Error(data.message || 'Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError(error.message || 'Unknown error fetching profile');
            }
        }

        fetchProfile();
    }, []);

    const handlePeriodChange = (e) => {
        setPeriodo(e.target.value);
    };

    const fetchSessions = async (queryPeriodo = '') => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const url = new URL('https://209.126.125.63/api/sessions');
    
        if (queryPeriodo) {
            url.searchParams.append('periodo', queryPeriodo);
        }
    
        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const transformedSessions = data.sessions.map((session) => ({
                id: session.id,
                date: new Date(session.date).toLocaleDateString('es-ES'),
                startHour: session.start_hour,
                endHour: session.end_hour,
                subject: `Curso: ${session.course_code}`,
                mode: session.mode
            }));
            setSessions(transformedSessions);
        } catch (error) {
            console.error("Could not fetch sessions:", error);
            setError(`Failed to fetch sessions: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        fetchSessions(periodo);
    }, [periodo]);

    if (loading) return <div className="loading-message">Cargando...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    
    const handleSessionClick = (sessionId, session) => {
        navigate(`/SessionVistaEstudiante/${sessionId}`, { state: session });
    };

    return (
        <>  

            <div className={`sessions-container ${isSidebarOpen ? 'shifted' : ''}`}> 
                <h1 className="sessions-title">Próximas Sesiones</h1>
                <div className="session-filters">
                    <label htmlFor="periodo-select">Elige el periodo:</label>
                    <select id="periodo-select" value={periodo} onChange={handlePeriodChange} className="periodo-selector">
                        <option value="">Todas las Sesiones</option>
                        <option value="manana">Mañana</option>
                        <option value="tarde">Tarde</option>
                        <option value="noche">Noche</option>
                    </select>
                </div>
                {user.typeuser === '2' && (
                    <button onClick={() => navigate('/sessions/create')} className="create-session-button">
                        Crear Nueva Sesión
                    </button>
                )}
                <div className='yes-sessions'>
                    {sessions.length > 0 ? (
                        sessions.map(session => (
                            <button key={session.id} onClick={() => handleSessionClick(session.id, session)} className="session-card-button">
                                <SessionCard
                                    date={session.date}
                                    startHour={session.startHour}
                                    endHour={session.endHour}
                                    subject={session.subject}
                                    mode={session.mode}
                                />
                            </button>
                        ))
                    ) : (
                        <div className="no-sessions">No hay sesiones disponibles.</div>
                    )}
                </div>
            </div>  
        </>
    );
}

export default Sessions;
