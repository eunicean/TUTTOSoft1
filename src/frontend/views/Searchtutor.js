import React, { useState, useEffect  } from 'react'; 
import '../css/Seachtutor.css';

const TutorCard = ({ name, subjects, year, rating }) => {
  return (
    <div className="tutor-card">
      <div className="tutor-info">
        <div className="avatar-placeholder"></div>
        <div>
          <h4>{name}</h4>
          <p>{subjects.join(', ')}</p> {/* Mostrar todas las materias */}
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
  const [tutors, setTutors] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch('http://localhost:5000/tutors');
        const data = await response.json();
        
        const formattedTutors = data.map(tutor => ({
          name: tutor.username,
          subjects: tutor.courses.split(', '), 
          year: 5,  // Año fijo
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
    const matchesSubject = selectedSubjects.length === 0 || tutor.subjects.some(subject => selectedSubjects.includes(subject));
    const matchesSearchTerm = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
              subjects={tutor.subjects}
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
