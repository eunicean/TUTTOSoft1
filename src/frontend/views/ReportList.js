import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import '../css/ReportList.css'; // Estilos específicos para esta vista


const ReportList = () => {
  const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);


  const tutors = [
    { id: 7, name: 'Nombre de Tutor', carnet: '111111', sessions: 15, subject: 'Cálculo 1' },
    { id: 8, name: 'Nombre de Tutor', carnet: '145861', sessions: 7, subject: 'Cálculo 1' },
    { id: 3, name: 'Nombre de Tutor', carnet: '157893', sessions: 5, subject: 'Cálculo 1' },
  ];


  const handleViewReport = (tutor) => {
    navigate(`/report/${tutor.id}`, { state: { tutor } }); // Navegar a la vista de reporte con los datos del tutor
  };


  return (
    <div className="report-list-container">
      <h1>Listado de reportes</h1>
      <div className="employee-card">
        <h2>Nombre Empleado</h2>
        <p>Código: 12345</p>
        <button className="logout-button">Cerrar Sesión</button>
      </div>
      <div className="tutor-list">
        {tutors.map((tutor) => (
          <div key={tutor.id} className="tutor-card">
            <h3>{tutor.name}</h3>
            <p>Carnet: {tutor.carnet}</p>
            <p>Sesiones: {tutor.sessions}</p>
            <p>Materia: {tutor.subject}</p>
            <button onClick={() => handleViewReport(tutor)} className="view-report-button">
              Ver reportes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ReportList;
