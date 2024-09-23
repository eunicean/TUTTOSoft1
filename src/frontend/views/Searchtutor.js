import React, { useState } from 'react';
import '../css/Seachtutor.css';

const TutorCard = ({ name, subject, year, rating }) => {
  return (
    <div className="tutor-card">
      <div className="tutor-info">
        <div className="avatar-placeholder"></div>
        <div>
          <h4>{name}</h4>
          <p>{subject}</p>
          <p>{year} año</p>
          <div className="stars">
            {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
          </div>
        </div>
      </div>
      <button className="chat-btn">Chat</button>
    </div>
  );
};

const Filter = ({ selectedSubjects, setSelectedSubjects }) => {
  const handleCheckboxChange = (subject) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(item => item !== subject)
        : [...prev, subject]
    );
  };

  const subjects = [
    'Física I', 'Cálculo I', 'Cálculo II', 'Mate discreta',
    'Teoría de probabilidades', 'Pensamiento cuantitativo', 'Razonamiento cuantitativo'
  ];

  return (
    <div className="filter">
      <h4>Materia</h4>
      {subjects.map((subject, index) => (
        <label key={index}>
          <input
            type="checkbox"
            checked={selectedSubjects.includes(subject)}
            onChange={() => handleCheckboxChange(subject)}
          />
          {subject}
        </label>
      ))}
    </div>
  );
};

const TutorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const tutors = [
    { name: 'Tutor 1', subject: 'Física I', year: 5, rating: 4 },
    { name: 'Tutor 2', subject: 'Cálculo I', year: 5, rating: 3 },
    { name: 'Tutor 3', subject: 'Mate discreta', year: 5, rating: 5 },
  ];

  const filteredTutors = tutors.filter(tutor => {
    const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(tutor.subject);
    const matchesSearchTerm = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.year.toString().includes(searchTerm);

    return matchesSubject && matchesSearchTerm;
  });

  return (
    <div className="tutors-page">
      <div className="header">
    
        <h1>Tutores</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Nombre, materia, año"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>
      <div className="content">
        <div className="tutors-list">
          {filteredTutors.map((tutor, index) => (
            <TutorCard
              key={index}
              name={tutor.name}
              subject={tutor.subject}
              year={tutor.year}
              rating={tutor.rating}
            />
          ))}
        </div>
        <Filter selectedSubjects={selectedSubjects} setSelectedSubjects={setSelectedSubjects} />
      </div>
    </div>
  );
};

export default TutorsPage;
