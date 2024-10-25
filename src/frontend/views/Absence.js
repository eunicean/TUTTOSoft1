import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';
import '../css/Absence.css'; 
import baseUrl from '../../config.js';


function CancelSessionView({ Idsession }) {
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { sessionId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleCancelSession = async () => {
        const token = localStorage.getItem('token');

        if (!reason) {
            setMessage('El motivo de la cancelación es obligatorio');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/report-absence/${sessionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: reason }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Reporte de ausencia registrado exitosamente');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al reportar la ausencia:', error);
            setMessage('Error al reportar la ausencia');
        }
    };

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <>
            <div className={`absence-container ${isSidebarOpen ? 'shifted' : ''}`}>
                <h1 className="absence-title">Reportar Ausencia</h1>
                <div className="absence-filters">
                    <label>
                        Motivo de la ausencia:
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="absence-reason-textarea"
                        />
                    </label>
                </div>
                <div className="absence-button-container">
                    <button onClick={handleCancelSession} className="absence-submit-button">
                        Enviar
                    </button>
                </div>
                {message && <p className="absence-message">{message}</p>}
            </div>
        </>
    );
}

export default CancelSessionView;
