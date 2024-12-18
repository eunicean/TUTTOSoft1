// src/frontend/views/AdminTutor.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterDropdown from '../components/FilterDropdown.js'; 
import '../css/AdminTutor.css'; 
import baseUrl from '../../config.js';
import ProfilePicture from '../components/profilePicture.js';

const TutorCard = ({ name, subjects, year, rating, isAdmin, handleReportClick }) => {
  return (
    <div className="tutor-card-searchadmin">
      <div className="tutor-info-searchadmin">
        <ProfilePicture></ProfilePicture>
        <div>
          <h4>{name}</h4>
          <h4>{subjects.join(', ')}</h4>
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

  const handleReportClick = (tutor) => {
    navigate(`/report/${tutor.id}`, { state: { tutor, subjects: tutor.subjects } });
  };

  useEffect(() => {
    const fetchTutors = async () => {
      const token = localStorage.getItem('token');
      try {
        
        // const url = `${baseUrl}/api/tutors`;

        const response = await fetch('/api/tutors', {
          headers: {
              'Authorization': `Bearer ${token}`, 
          }
        });
        const data = await response.json();

        const formattedTutors = data.map(tutor => ({
          id: tutor.id,  
          name: tutor.username,
          subjects: tutor.courses.split(', '),
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
                placeholder="Nombre, materia"
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
                    rating={tutor.rating}
                    isAdmin={isAdmin}
                    handleReportClick={() => handleReportClick(tutor)}  
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
