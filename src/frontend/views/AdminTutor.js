// src/frontend/views/AdminTutor.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterDropdown from '../components/FilterDropdown.js'; 
import '../css/AdminTutor.css'; 

const TutorCard = ({ name, subjects, year, rating, isAdmin, handleReportClick }) => {
  return (
    <div className="tutor-card-searchadmin">
      <div className="tutor-info-searchadmin">
        <div className="avatar-placeholder-searchadmin"></div>
        <div>
          <h4>{name}</h4>
          <h4>{subjects.join(', ')}</h4>
          <h4>{year} año</h4>
          <div className="stars">
            {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
          </div>
        </div>
      </div>    
        <button className="report-btn-search" onClick={handleReportClick}>Reportes</button>     
    </div>
  );
};

const TutorsPage = ({ isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
    }
  }, [navigate]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para manejar el clic en el botón de "Reportes"
  const handleReportClick = (tutor) => {
    navigate(`/report/${tutor.id}`, { state: { tutor } });  // Redirigir a la ruta con el ID del tutor y los datos del tutor
  };

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || '';
        const url = `${baseUrl}/api/tutors`;

        const response = await fetch(url);
        const data = await response.json();

        const formattedTutors = data.map(tutor => ({
          id: tutor.id,  // Asegúrate de que cada tutor tenga un ID
          name: tutor.username,
          subjects: tutor.courses.split(', '),
          year: 5,  // Ajustar según lo que necesites
          rating: Math.round(tutor.avg_rating)
        }));
        setTutors(formattedTutors);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter(tutor => {
    const matchesSubject = selectedSubject === '' || tutor.subjects.includes(selectedSubject);
    const matchesSearchTerm = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tutor.year.toString().includes(searchTerm);

    return matchesSubject && matchesSearchTerm;
  });

  return (
    <div className="outer-container-search">
      <div className={`sessions-container-search`}>
        <div className="tutors-page">
          <div className="header-search">
            <h2>{isAdmin ? 'Admin-Buscar Tutor' : 'admin-Buscar Tutor'}</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Nombre, materia, año"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <FilterDropdown selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
            </div>
          </div>
          <div className="content">
            <div className="tutors-list">
              {filteredTutors.length > 0 ? (
                filteredTutors.map((tutor, index) => (
                  <TutorCard
                    key={index}
                    name={tutor.name}
                    subjects={tutor.subjects}
                    year={tutor.year}
                    rating={tutor.rating}
                    isAdmin={isAdmin}
                    handleReportClick={() => handleReportClick(tutor)}  // Pasar el tutor seleccionado
                  />
                ))
              ) : (
                <p>No se encontraron tutores.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorsPage;
