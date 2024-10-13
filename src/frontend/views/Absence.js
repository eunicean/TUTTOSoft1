import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';
import '../css/Sessions.css';
import '../css/Sidebar.css';
import '../css/Navbar.css';

function CancelSessionView({ Idsession }) {
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { sessionId } = useParams();

    const handleCancelSession = async () => {
        const token = localStorage.getItem('token');

        if (!reason) {
            setMessage('El motivo de la cancelación es obligatorio');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/report-absence/${sessionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: reason }), // Enviamos el motivo como "message"
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

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            <Navbar />
            <div className={`sessions-container ${isSidebarOpen ? 'shifted' : ''}`}>
                <button className="menu-toggle" onClick={toggleSidebar}>Menu</button>
                <h1 className="sessions-title">Reportar Ausencia</h1>
                <div className="session-filters">
                    <label>
                        Motivo de la ausencia:
                        <input 
                            type="text" 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)} 
                            className="periodo-selector" 
                        />
                    </label>
                </div>
                <button onClick={handleCancelSession} className="create-session-button">
                    Enviar
                </button>
                {message && <p>{message}</p>}
            </div>
        </>
    );
}

export default CancelSessionView;
