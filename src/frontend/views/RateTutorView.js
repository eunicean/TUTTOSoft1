import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import '../css/RateTutorView.css'; // Asegúrate de ajustar la ruta según la estructura de carpetas

function RateTutorView({ tutorId }) {
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleSubmitRating = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/rate-tutor', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tutorId, rating }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Calificación guardada exitosamente');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al guardar la calificación:', error);
            setMessage('Error al guardar la calificación');
        }
    };

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
                <h1>Calificar al tutor</h1>
                <div className="rate-tutor-card">
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
                    <div className="tutor-info">
                        <div className="avatar-placeholder"></div>
                        <p>Nombre de Tutor</p>
                        <p>5to año</p>
                    </div>
                    <button className="submit-button" onClick={handleSubmitRating}>Enviar</button>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </>
    );
}

export default RateTutorView;
