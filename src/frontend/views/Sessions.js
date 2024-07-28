import React, { useState, useEffect } from 'react';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [periodo, setPeriodo] = useState('');
    const [newSession, setNewSession] = useState({
        subject: '',
        date: '',
        startHour: '',
        endHour: ''
    });
    const navigate = useNavigate();

    const handlePeriodChange = (e) => {
        setPeriodo(e.target.value);
    };

    const handleInputChange = (e) => {
        setNewSession({ ...newSession, [e.target.name]: e.target.value });
    };

    const submitNewSession = async () => {
        const token = localStorage.getItem('token');
        const url = 'http://localhost:5000/sessions/create';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSession),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setSessions([
                    ...sessions,
                    {
                        ...newSession,
                        id: data.id,
                        date: new Date(newSession.date).toLocaleDateString('es-ES'),
                        time: `${newSession.startHour} - ${newSession.endHour}`
                    }
                ]);
                setNewSession({ subject: '', date: '', startHour: '', endHour: '' });
            } else {
                throw new Error(data.message || 'Failed to create session');
            }
        } catch (error) {
            console.error("Could not create session:", error);
            setError(`Failed to create session: ${error.message || 'Unknown error'}`);
        }
    };

    const fetchSessions = async (queryPeriodo = '') => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const url = new URL('http://localhost:5000/sessions');

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
                date: new Date(session.dated).toLocaleDateString('es-ES'),
                startHour: session.start_hour,
                endHour: session.end_hour,
                subject: `Curso: ${session.course_code}`,
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

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    if (loading) return <div className="loading-message">Cargando...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    const handleSessionClick = (sessionId) => {
        navigate(`/sessions-info/${sessionId}`);
    };

    const handleRateClick = (sessionId) => {
        navigate(`/rate-tutor/${sessionId}`);
    };

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            <Navbar />
            <div className={`sessions-container ${isSidebarOpen ? 'shifted' : ''}`}>
                <button className="menu-toggle" onClick={toggleSidebar}>Menu</button>
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
                <div className="create-session-form">
                    <input name="subject" value={newSession.subject} onChange={handleInputChange} placeholder="Curso" />
                    <input type="date" name="date" value={newSession.date} onChange={handleInputChange} />
                    <input type="time" name="startHour" value={newSession.startHour} onChange={handleInputChange} />
                    <input type="time" name="endHour" value={newSession.endHour} onChange={handleInputChange} />
                    <button onClick={submitNewSession}>Crear Sesión</button>
                </div>
                <div className='session-list'>
                    {sessions.length > 0 ? (
                        sessions.map(session => (
                            <div key={session.id} className="session-card">
                                <div className="session-info" onClick={() => handleSessionClick(session.id)}>
                                    <p><strong>Materia:</strong> {session.subject}</p>
                                    <p><strong>Fecha:</strong> {session.date}</p>
                                    <p><strong>Horario:</strong> {session.startHour} - {session.endHour}</p>
                                </div>
                                <div className="session-actions">
                                    <button className="session-button" onClick={() => handleRateClick(session.id)}>Calificar sesión</button>
                                    <button className="session-button">Reportar ausencia</button>
                                </div>
                            </div>
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
