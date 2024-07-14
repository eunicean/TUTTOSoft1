import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpecificSession from '../components/SpecificSession.js';

function TestingView() {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para controlar el indicador de carga
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const token = localStorage.getItem('token');
            const url = `http://localhost:5000/session-info/${sessionId}`;

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

    if (loading) {
        return <p>Loading...</p>; // Display while data is loading
    }

    if (error) {
        return <p>Error: {error}</p>; // Display errors
    }

    return (
        <div>
            {session ? (
                <SpecificSession
                    key={session.id}
                    date={new Date(session.date).toLocaleDateString('en-US')}
                    startHour={session.startHour}
                    endHour={session.endHour}
                    subject={session.subject}
                    tutorName={session.tutorName}
                    studentName={session.studentName}
                />
            ) : (
                <p>No session available.</p> // Message if no session is available
            )}
        </div>
    );
}

export default TestingView;
