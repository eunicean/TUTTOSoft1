import React, { useState, useEffect } from 'react';
import SessionCard from '../components/Card.js';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';
import { useNavigate } from 'react-router-dom';
import '../css/Sessions.css';
import '../css/Sidebar.css';
import '../css/Navbar.css';
import baseUrl from '../../config.js';

function Sessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodo, setPeriodo] = useState('');
    const [user, setUser] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

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
        navigate(`/DetallesTutor/${sessionId}`, { state: session });
    };

    return (
        <>
            <div className='outer-container'>
                <div className={`sessions-container ${isSidebarOpen ? 'shifted' : ''}`}>
                    <div className='sessions-header'>
                        <h1 className="TituloPS">Próximas Sesiones</h1>
                        <div className="buttons-group">
                            {user.typeuser === '2' && (
                                <button onClick={() => navigate('/sessions/create')} className="create-session-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><mask id="lineMdFilePlusTwotone0"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#fff" fill-opacity="0" stroke-dasharray="64" stroke-dashoffset="64" d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.15s" values="0;0.3"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path d="M14.5 3.5l2.25 2.25l2.25 2.25z" opacity="0"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M14.5 3.5l2.25 2.25l2.25 2.25z;M14.5 3.5l0 4.5l4.5 0z"/><set fill="freeze" attributeName="opacity" begin="0.6s" to="1"/></path><path fill="#000" fill-opacity="0" stroke="none" d="M19 13c3.31 0 6 2.69 6 6c0 3.31 -2.69 6 -6 6c-3.31 0 -6 -2.69 -6 -6c0 -3.31 2.69 -6 6 -6Z"><set fill="freeze" attributeName="fill-opacity" begin="1s" to="1"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M16 19h6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="8;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M19 16v6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="8;0"/></path></g></mask><rect width="24" height="24" fill="currentColor" mask="url(#lineMdFilePlusTwotone0)"/></svg>
                                    Crear Nueva Sesión
                                </button>
                            )}
                            {(user.typeuser === '1' || user.typeuser === '2') && (
                                <button onClick={() => navigate('/seachtutor')} className="create-session-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="currentColor" fill-opacity="0" stroke-dasharray="40" stroke-dashoffset="40" d="M10.76 13.24c-2.34 -2.34 -2.34 -6.14 0 -8.49c2.34 -2.34 6.14 -2.34 8.49 0c2.34 2.34 2.34 6.14 0 8.49c-2.34 2.34 -6.14 2.34 -8.49 0Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.15s" values="0;0.3"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="40;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M10.5 13.5l-7.5 7.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="12;0"/></path></g></svg>
                                    Buscar un nuevo tutor
                                </button>
                            )}
                            {(user.typeuser === '1' || user.typeuser === '2') && (
                                <button onClick={() => navigate('/chat')} className="create-session-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><mask id="lineMdChatFilled0"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#fff" fill-opacity="0" stroke-dasharray="72" stroke-dashoffset="72" d="M3 19.5v-15.5c0 -0.55 0.45 -1 1 -1h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-14.5Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"/></path><path stroke="#000" stroke-dasharray="10" stroke-dashoffset="10" d="M8 7h8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="10;0"/></path><path stroke="#000" stroke-dasharray="10" stroke-dashoffset="10" d="M8 10h8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.5s" dur="0.2s" values="10;0"/></path><path stroke="#000" stroke-dasharray="6" stroke-dashoffset="6" d="M8 13h4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.8s" dur="0.2s" values="6;0"/></path></g></mask><rect width="24" height="24" fill="currentColor" mask="url(#lineMdChatFilled0)"/></svg>
                                    Ir al chat
                                </button>
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
                                    date={session.date}
                                    startHour={session.startHour}
                                    endHour={session.endHour}
                                    subject={session.subject}
                                    mode={session.mode}
                                    onClick={() => handleSessionClick(session.id, session)} // manejo del click
                                />
                            ))
                        ) : (
                            <div className="no-sessions">No hay sesiones disponibles.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sessions;
