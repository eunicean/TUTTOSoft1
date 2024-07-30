import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.js'; // Added .js extension
import Navbar from '../components/Navbar.js'; // Added .js extension
import '../css/Sessions.css';
import '../css/Sidebar.css';
import '../css/Navbar.css';

function CancelSessionView({ sessionId }) {
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleCancelSession = async () => {
        const token = localStorage.getItem('token');
        if (!reason) {
            setMessage('El motivo de la cancelación es obligatorio');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/cancel-session', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId, reason }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Sesión cancelada y motivo guardado exitosamente');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al cancelar la sesión:', error);
            setMessage('Error al cancelar la sesión');
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <>
          <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
          <Navbar />
          <div className={`sessions-container ${isSidebarOpen ? 'shifted' : ''}`}>
            <button className="menu-toggle" onClick={toggleSidebar}>Menu</button>
            <h1 className="sessions-title">Cancelar sesion</h1>
            <div className="session-filters">
              <label>
                Motivo de la cancelacion:
                <input 
                  type="text" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  className="periodo-selector" 
                />
              </label>
            </div>
            <button onClick={handleCancelSession} className="create-session-button">
              Cancelar sesion
            </button>
            {message && <p>{message}</p>}
          </div>
        </>
    );
}

export default CancelSessionView;
