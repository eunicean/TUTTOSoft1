import React, { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import '../css/ReportDetails.css'; // Estilos específicos para esta vista


const ReportDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tutor } = location.state; // Obtener los datos del tutor seleccionados desde la otra vista

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

  const report = {
    attendancePercentage: 97,
    subjects: [
      { name: 'Física 1', attendance: '66%', averageRating: 4.5 },
      { name: 'Cálculo 1', attendance: '100%', averageRating: 4.7 },
    ],
  };


  return (
    <div className="report-details-container">
      <h1>Reporte de tutorías</h1>
      <button onClick={() => navigate(-1)} className="back-button">Atrás</button>
      <div className="tutor-info">
        <h2>{tutor.name}</h2>
        <p>{tutor.sessions}o año</p>
        <p>Carnet: {tutor.carnet}</p>
      </div>
      <div className="report-info">
        <h3>Porcentaje de asistencia: {report.attendancePercentage}%</h3>
        <table>
          <thead>
            <tr>
              <th>Materia</th>
              <th>Porcentaje de asistencia</th>
              <th>Calificación promedio</th>
            </tr>
          </thead>
          <tbody>
            {report.subjects.map((subject, index) => (
              <tr key={index}>
                <td>{subject.name}</td>
                <td>{subject.attendance}</td>
                <td>{subject.averageRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default ReportDetails;


