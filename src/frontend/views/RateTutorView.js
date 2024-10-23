import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener sessionID desde la URL
import Sidebar from '../components/Sidebar.js';
import '../css/RateTutorView.css'; // Ajusta la ruta según la estructura de tus carpetas

function RateTutorView({ tutorId }) {
    // Estados para manejar la calificación, mensaje, apertura de la barra lateral y comentarios
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [comments, setComments] = useState('');
    const { sessionId } = useParams(); // Obtener sessionID desde la URL

    // Maneja el clic en una estrella y actualiza la calificación
    const handleStarClick = (value) => {
        setRating(value);
    };

    // Envía la calificación de la sesión al servidor
    const handleSubmitRating = async () => {
        const token = localStorage.getItem('token');

        try {
            const baseUrl = process.env.REACT_APP_API_URL || '';
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
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            <div className={`rate-tutor-container ${isSidebarOpen ? 'shifted' : ''}`}>
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <span className="menu-bar"></span>
                    <span className="menu-bar"></span>
                    <span className="menu-bar"></span>
                </button>
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
        </>
    );
}

export default RateTutorView;
