const React = require('react');
const { useState, useEffect } = React;

require('../css/Searchtutor.css');

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

const FilterDropdown = ({ selectedSubject, setSelectedSubject }) => {
  const subjects = [
    'Física I', 'Cálculo I', 'Cálculo II', 'Mate discreta',
    'Teoría de probabilidades', 'Pensamiento cuantitativo', 'Razonamiento cuantitativo',
    'Historia Universal', 'Matemáticas Básicas'
  ];

  return (
    <select
      value={selectedSubject}
      onChange={(e) => setSelectedSubject(e.target.value)}
      className="filter-dropdown"
    >
      <option value="">Seleccionar materia</option>
      {subjects.map((subject, index) => (
        <option key={index} value={subject}>
          {subject}
        </option>
      ))}
    </select>
  );
};

const TutorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
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
    const matchesSubject = selectedSubject === '' || tutor.subjects.includes(selectedSubject);
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
          <FilterDropdown selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
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
      </div>
    </div>
  );
};

export default TutorsPage;
