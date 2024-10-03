const React = require('react');
const { useState } = React;

const Sidebar = require('../components/Sidebar.js');
require('../css/CancelSessionView.css');

const { useParams, useNavigate } = require('react-router-dom');


function CancelView() {
    const { sessionId } = useParams();
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false); // Estado para controlar el modal de error
    const [loading, setLoading] = useState(false); // Añadir estado de carga
    const navigate = useNavigate();

    const handleCancelSession = async () => {
        const token = localStorage.getItem('token');
        const url = `http://localhost:5000/cancel-session/${sessionId}`;
        setLoading(true);

        if (!reason.trim()) {
            setMessage('El motivo de la cancelación es obligatorio');
            setShowErrorModal(true); // Mostrar el modal de error
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(url, {
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
                setShowModal(false);
                navigate('/sessions');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al cancelar la sesión:', error);
            setMessage('Error al cancelar la sesión');
        }
        setLoading(false);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const openModal = () => {
        if (!reason.trim()) { // Verifica si el campo de motivo está vacío
            setMessage('Error: campo vacío');
            setShowErrorModal(true); // Mostrar el modal de error
            return;
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);
    const closeErrorModal = () => setShowErrorModal(false); // Función para cerrar el modal de error

    return (
        <>
            {/* <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} /> */}
            <div className={`cancel-session-container ${isSidebarOpen ? 'shifted' : ''}`}>
                {/* <button className="menu-toggle" onClick={toggleSidebar}>
                    <span className="menu-bar"></span>
                    <span className="menu-bar"></span>
                    <span className="menu-bar"></span>
                </button> */}
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
                {message && !showErrorModal && <p className="message">{message}</p>}

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>¿Está seguro de que desea cancelar la sesión?</p>
                            <button onClick={handleCancelSession}>Sí, cancelar sesión</button>
                            <button onClick={closeModal}>No, volver</button>
                        </div>
                    </div>
                )}

                {showErrorModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>{message}</p>
                            <button onClick={closeErrorModal}>Cerrar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CancelView;
