import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import '../css/CancelSessionView.css'; // Ajusta la ruta según la estructura de carpetas

function CancelView({ sessionId }) {
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
                setShowModal(false); // Close the modal after successful cancellation
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al cancelar la sesión:', error);
            setMessage('Error al cancelar la sesión');
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            <div className={`cancel-session-container ${isSidebarOpen ? 'shifted' : ''}`}>
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <span className="menu-bar"></span>
                    <span className="menu-bar"></span>
                    <span className="menu-bar"></span>
                </button>
                <h1>Cancelar Sesión</h1>
                <div className="cancel-session-card">
                    <div className="cancel-session-reason">
                        <label>
                            Motivo de la Cancelación:
                            <textarea 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)} 
                            />
                        </label>
                    </div>
                    <div className="cancel-session-tutor">
                        <div className="tutor-avatar"></div>
                        <div className="tutor-info">
                            <p>Nombre de Tutor</p>
                            <p>5to año</p>
                        </div>
                    </div>
                </div>
                <button className="submit-button" onClick={openModal}>Cancelar Sesión</button>
                {message && <p className="message">{message}</p>}

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>¿Está seguro de que desea cancelar la sesión?</p>
                            <button onClick={handleCancelSession}>Sí, cancelar sesión</button>
                            <button onClick={closeModal}>No, volver</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CancelView;
