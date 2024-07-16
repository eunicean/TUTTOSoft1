import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CancelSessionView.css';

function CancelSessionView({ sessionId }) {
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Maneja la cancelación de la sesión
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

    // Navega a la página anterior
    const handleBack = () => {
        navigate(-1);
    };

    // Abre la ventana emergente de confirmación
    const confirmCancelSession = () => {
        setShowModal(true);
    };

    // Cierra la ventana emergente de confirmación
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="cancel-session-container">
                <button className="menu-toggle" onClick={handleBack}>
                    <span className="menu-bar"></span>
                    <span className="menu-bar"></span>
                    <span className="menu-bar"></span>
                </button>
                <h1>Cancelar Cita</h1>
                <div className="cancel-session-card">
                    <div className="cancel-session-reason">
                        <label>
                            Motivo
                            <textarea 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)} 
                                placeholder="Escriba aquí otras cosas que le gustaría decir"
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
                <button className="submit-button" onClick={confirmCancelSession}>Enviar</button>
                {message && <p className="message">{message}</p>}
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>¿Seguro que deseas cancelar la sesión?</p>
                        <button onClick={handleCancelSession}>Sí</button>
                        <button onClick={closeModal}>No</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CancelSessionView;
