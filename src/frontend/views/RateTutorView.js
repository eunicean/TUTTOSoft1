import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para obtener sessionID desde la URL
import Sidebar from '../components/Sidebar.js';
import '../css/RateTutorView.css'; // Ajusta la ruta según la estructura de tus carpetas
import baseUrl from '../../config.js';
// import modal....
import Modal from '../components/Modal.js';

function RateTutorView({ sessionId: sessionIdProp, isOpen, onClose }) {
    // Estados para manejar la calificación, mensaje, apertura de la barra lateral y comentarios
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [comments, setComments] = useState('');
    // manejos del session id.
    const { sessionId: sessionIdFromUrl } = useParams(); // obtener el session id de la url.
    const sessionId = sessionIdProp || sessionIdFromUrl; // usar el prop o el de la url.

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleStarClick = (value) => {
        setRating(value);
    };

    // Envía la calificación de la sesión al servidor
    const handleSubmitRating = async () => {
        if (!sessionId) {
            setMessage('No se ha proporcionado un ID de sesión.');
            return;
        }
        
        const token = localStorage.getItem('token');

        try {
            
            const url = `${baseUrl}/api/grade-session/${sessionId}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    calificacion: rating,
                    comentario: comments,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Calificación enviada: ${rating} estrellas`);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al enviar la calificación:', error);
            setMessage('Ocurrió un error al enviar la calificación.');
        }
    };

    // Maneja la apertura y cierre de la barra lateral
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
        <Modal isOpen={isOpen} onClose={onClose} sessionId={sessionId}> 
            <div className={`rate-tutor-container`}>
                <h1>Calificar al Tutor</h1>
                <div className="rate-tutor-card">
                    <div className="rating-section">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <span
                                    key={value}
                                    className={`star ${value <= rating ? 'selected' : ''}`}
                                    onClick={() => handleStarClick(value)}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Escriba aquí otras cosas que le gustaría decir"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="comments-box"
                        ></textarea>
                    </div>
                    <button className="submit-button" onClick={handleSubmitRating}>
                        Enviar
                    </button>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
            </Modal>
        </>
    );
}

export default RateTutorView;
