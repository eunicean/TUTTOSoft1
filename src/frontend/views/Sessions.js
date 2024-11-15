import React, { useState, useEffect } from 'react';
import SessionCard from '../components/Card.js';
import { useNavigate } from 'react-router-dom';
import '../css/Sessions.css';
import CreateSession from './createSession.js';
import baseUrl from '../../config.js';

function Sessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodo, setPeriodo] = useState('');
    const [user, setUser] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    // Modal para crear sesión
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem('token');
            const url = `${baseUrl}/api/profile`;

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

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        fetchSessions(periodo);
    }, [periodo]);

    const handlePeriodChange = (e) => {
        setPeriodo(e.target.value);
    };

    const fetchSessions = async (queryPeriodo = '') => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        let url = `${baseUrl}/api/sessions`;

        if (queryPeriodo) {
            url += `?periodo=${queryPeriodo}`;
        }

        try {
            const response = await fetch(url, {
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
                subject: session.namecourse,
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

    if (loading) return <div className="loading-message">Cargando...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    const handleSessionClick = (sessionId, session) => {
        navigate(`/DetallesTutor/${sessionId}`, { state: session });
    };

    
    if (user.typeuser === '3') {
        navigate('/reportlist');
        return null;
    }

    return (
        <div className='outer-container'>
            <div className={`sessions-container ${isSidebarOpen ? 'shifted' : ''}`}>
                <div className='sessions-header'>
                    <h1 className="TituloPS">Próximas Sesiones</h1>
                    <div className="buttons-group">
                        {user.typeuser === '2' && (
                            <>
                                <button onClick={openModal} className="create-session-button">
                                    Crear Nueva Sesión
                                </button>
                                <CreateSession isOpen={isModalOpen} onClose={closeModal} />
                            </>
                        )}
                        {(user.typeuser === '1' || user.typeuser === '2') && (
                            <>
                                <button onClick={() => navigate('/seachtutor')} className="create-session-button">
                                    Buscar un nuevo tutor
                                </button>
                                <button onClick={() => navigate('/chat')} className="create-session-button">
                                    Ir al chat
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="session-filters">
                    <label htmlFor="periodo-select">Elige el periodo:</label>
                    <select id="periodo-select" value={periodo} onChange={handlePeriodChange} className="periodo-selector">
                        <option value="">Todas las Sesiones</option>
                        <option value="manana">Mañana</option>
                        <option value="tarde">Tarde</option>
                        <option value="noche">Noche</option>
                    </select>
                </div>
                <div className='yes-sessions'>
                    {sessions.length > 0 ? (
                        sessions.map(session => (
                            <SessionCard
                                key={session.id}
                                date={session.date}
                                startHour={session.startHour}
                                endHour={session.endHour}
                                subject={session.subject}
                                mode={session.mode}
                                onClick={() => handleSessionClick(session.id, session)}
                            />
                        ))
                    ) : (
                        <div className="no-sessions">No hay sesiones disponibles.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sessions;
