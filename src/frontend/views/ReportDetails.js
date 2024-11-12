import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/ReportDetails.css';

const ReportDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tutor, subjects = [] } = location.state || {};

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="vista-container">
            <div className="header1">
                <span className="session-text">Reporte de Tutorías</span>
                <button onClick={() => navigate(-1)} className="cancel-sessionBTN">Regresar</button>
            </div>
            
            <div className="content">
                <div className="card1">
                    <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
                    <h3>Nombre: {tutor?.name || 'N/A'}</h3>
                    <div className="stars">
                        {'★'.repeat(tutor?.rating || 0) + '☆'.repeat(5 - (tutor?.rating || 0))}
                    </div>
                    <button>Marcar revisión</button>
                </div>

                <div className="info">
                    <div className="TitulosInfo">
                        <h2>Porcentaje de Asistencia: 97%</h2>
                    </div>

                    <hr className="divider" />
                    
                    <div className="Info2">
                        <div className="temas">
                            <h2>Detalles del Reporte</h2>
                            <div className="temas-card1">
                                <h2>Materias y Calificaciones</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Materia</th>
                                            <th>Porcentaje de Asistencia</th>
                                            <th>Calificación Promedio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subjects.map((subject, index) => (
                                            <tr key={index}>
                                                <td>{subject}</td>
                                                <td>{'N/A'}</td> {/* Placeholder, modificar con datos reales */}
                                                <td>{tutor?.rating || 'N/A'}</td> {/* Placeholder para la calificación */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
