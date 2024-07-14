import React, { useState, useEffect } from 'react';
import Card from '../components/Card.js';

function TestingView() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);  // Estado para controlar el indicador de carga
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true; // Flag para manejar el renderizado condicional
        const fetchSessions = async () => {
            const token = localStorage.getItem('token');
            const url = 'http://localhost:5000/session-info';
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success && isMounted) {
                    setSessions(data.sessions);
                    setError(null);
                } else {
                    setError(data.message || 'No sessions found');
                }
            } catch (error) {
                if (isMounted) {
                    setError(`Failed to fetch sessions: ${error.message}`);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchSessions();

        return () => {
            isMounted = false; // Evita que se llame a setState si el componente está desmontado
        };
    }, []);

    if (loading) {
        return <p>Loading...</p>; // Visualización mientras los datos están cargando
    }

    if (error) {
        return <p>{error}</p>; // Visualización de errores
    }

    return (
        <div>
            {sessions.length > 0 ? (
                sessions.map(session => (
                    <Card
                        key={session.id}
                        date={session.date}
                        startHour={session.startHour}
                        endHour={session.endHour}
                        subject={session.subject}
                        otherPartyName={session.otherPartyName}
                    />
                ))
            ) : (
                <p>No sessions available.</p>  // Mensaje si no hay sesiones
            )}
        </div>
    );
}

export default TestingView;
