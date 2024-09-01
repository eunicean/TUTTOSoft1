import React, { useState, useEffect } from 'react';
import SessionCard from '../components/Card.js';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';
import { useNavigate } from 'react-router-dom'; 
import '../css/Sessions.css';
import '../css/Sidebar.css';
import '../css/Navbar.css';

function SessionsHistory(){
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodo, setPeriodo] = useState('');
    const [user, setUser] = useState({});
    const [isSidebarOpen,  setIsSidebarOpen] = useState(false);
    const navigate = useNavigate

    const fetchSessionsHistory = async =>{
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token')
        const url = new URL('http://localhost:5000/sessions-history');

        try{

        }catch(error){
            console.error("Could not fetch any sessions: ", error)
            setError(`Failed to fetch sessions: ${error.message || 'Unknown error'}`);

        }finally{
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSessionsHistory();
    } );

    if (loading) return <div className="loading-message">Cargando...</div>;
        if (error) return <div className="error-message">Error: {error}</div>;


    
    const handleSessionClick = (sessionId, session) => {
        navigate(`/SessionVistaEstudiante/${sessionId}`, { state: session });
    };  
    
    return(
        <> 
            <div className='history-container'>
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
    )
}

export default SessionsHistory;