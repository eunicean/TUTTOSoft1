import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ReportList.css';

const ReportCard = ({ tutor, handleReportClick }) => {
  return (
    <div className="report-card">
      <div className="report-info">
        <div className="avatar-placeholder"></div>
        <div>
          <h4>{tutor.name}</h4>
          <h5>Materias:</h5>
          <p>{tutor.subjects.join(', ')}</p> {/* Ajuste en la forma en que se renderizan las materias */}
          <div className="stars">
            {'★'.repeat(tutor.rating) + '☆'.repeat(5 - tutor.rating)}
          </div>
        </div>
      </div>
      <button onClick={() => handleReportClick(tutor)} className="report-btn">Ver Reportes</button>
    </div>
  );
};

const ReportList = () => {
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTutors = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('/api/tutors', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const formattedTutors = data.map(tutor => ({
          id: tutor.id,
          name: tutor.username,
          subjects: tutor.courses.split(', '),
          rating: Math.round(tutor.avg_rating),
        }));
        setTutors(formattedTutors);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, []);

  const handleReportClick = (tutor) => {
    navigate(`/report/${tutor.id}`, { state: { tutor, subjects: tutor.subjects } });
  };

  return (
    <div className="report-list-container">
      <h1>Listado de Reportes</h1>
      <div className="tutor-list">
        {tutors.length > 0 ? (
          tutors.map((tutor, index) => (
            <ReportCard
              key={index}
              tutor={tutor}
              handleReportClick={handleReportClick}
            />
          ))
        ) : (
          <p>No se encontraron tutores.</p>
        )}
      </div>
    </div>
  );
};

export default ReportList;
