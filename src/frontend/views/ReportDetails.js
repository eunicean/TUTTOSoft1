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
        <div className="vista-container-details">
            <div className="header1-details">
                <span className="session-text">Reporte de Tutorías</span>
                <button>Marcar revisión</button>
                <button onClick={() => navigate(-1)} className="cancel-sessionBTN">Regresar</button>
            </div>
            
            <div className="content-details">
                <div className="card1">
                    <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
                    <h3>Nombre: {tutor?.name || 'N/A'}</h3>
                    <p>Tipo de Usuario: {tutor.typeuser === '1' ? 'Estudiante' : 'Tutor'}</p>
                    <div className="stars">
                        {'★'.repeat(tutor?.rating || 0) + '☆'.repeat(5 - (tutor?.rating || 0))}
                    </div>
                    <div>
                        <h3>Cursos Impartidos:</h3>
                        <table className="courses-table">
                            <tbody>
                                {subjects.map((subject, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}.</td>
                                        <td>{subject}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
