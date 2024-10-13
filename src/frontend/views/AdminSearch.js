import React, { useState, useEffect } from 'react';
import '../css/AdminSearch.css'; // Asegúrate de ajustar estilos como prefieras

const UserCard = ({ name, subjects, year, rating, role, onToggleRole }) => {
  return (
    <div className="user-card">
      <div className="user-info">
        <div className="avatar-placeholder"></div>
        <div>
          <h4>{name}</h4>
          {role === 'tutor' ? (
            <>
              <p>{subjects.join(', ')}</p> {/* Mostrar materias solo para tutores */}
              <p>{year} año</p>
              <div className="stars">
                {'★'.repeat(rating) + '☆'.repeat(5 - rating)} {/* Mostrar calificación */}
              </div>
            </>
          ) : (
            <p>{year} año (Estudiante)</p>
          )}
        </div>
      </div>
      <label className="switch">
        <input type="checkbox" checked={role === 'tutor'} onChange={onToggleRole} />
        <span className="slider round"></span>
      </label>
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

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [users, setUsers] = useState([]);
  const [viewTutors, setViewTutors] = useState(true); // true: Buscar Tutores, false: Buscar Estudiantes

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleView = () => {
    setViewTutors(!viewTutors);
  };

  const handleToggleRole = (userIndex) => {
    setUsers(prevUsers => {
      const updatedUsers = [...prevUsers];
      const user = updatedUsers[userIndex];
      user.role = user.role === 'tutor' ? 'estudiante' : 'tutor';
      return updatedUsers;
    });
  };

  useEffect(() => {
    // Datos de prueba simulados con 6 tutores y 6 estudiantes
    const simulatedUsers = [
      { name: 'Juan Pérez', role: 'tutor', subjects: ['Física I', 'Cálculo II'], year: 2, rating: 4 },
      { name: 'Ana López', role: 'tutor', subjects: ['Mate discreta', 'Teoría de probabilidades'], year: 3, rating: 5 },
      { name: 'Marta Hernández', role: 'tutor', subjects: ['Historia Universal'], year: 2, rating: 3 },
      { name: 'Luis Gómez', role: 'tutor', subjects: ['Cálculo I', 'Pensamiento cuantitativo'], year: 4, rating: 2 },
      { name: 'María Díaz', role: 'tutor', subjects: ['Cálculo II', 'Teoría de probabilidades'], year: 3, rating: 5 },
      { name: 'Ricardo Sánchez', role: 'tutor', subjects: ['Matemáticas Básicas'], year: 1, rating: 4 },

      { name: 'Carlos García', role: 'estudiante', subjects: [], year: 1, rating: 0 },
      { name: 'Sofía Martínez', role: 'estudiante', subjects: [], year: 4, rating: 0 },
      { name: 'Lucía Gómez', role: 'estudiante', subjects: [], year: 2, rating: 0 },
      { name: 'Pedro Fernández', role: 'estudiante', subjects: [], year: 3, rating: 0 },
      { name: 'Jorge Ruiz', role: 'estudiante', subjects: [], year: 2, rating: 0 },
      { name: 'Elena Torres', role: 'estudiante', subjects: [], year: 1, rating: 0 },
    ];
    
    setUsers(simulatedUsers);
  }, []);
  
  const filteredUsers = users.filter(user => {
    const matchesRole = viewTutors ? user.role === 'tutor' : user.role === 'estudiante';
    const matchesSubject = selectedSubject === '' || (user.subjects && user.subjects.includes(selectedSubject));
    const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.subjects && user.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      user.year.toString().includes(searchTerm);

    return matchesRole && matchesSubject && matchesSearchTerm;
  });

  return (
    <div className="admin-page">
      <div className={`header ${viewTutors ? 'tutors-header' : 'students-header'}`}>
        <h1>{viewTutors ? 'Buscar Tutor' : 'Buscar Estudiante'}</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Nombre, materia, año"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {viewTutors && (
            <FilterDropdown selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
          )}
        </div>
        <div className="toggle-container">
          <label>Buscar Estudiantes</label>
          <label className="switch">
            <input type="checkbox" checked={viewTutors} onChange={toggleView} />
            <span className="slider round"></span>
          </label>
          <label>Buscar Tutores</label>
        </div>
      </div>
      <div className="content">
        <div className="users-list">
          {filteredUsers.map((user, index) => (
            <UserCard
              key={index}
              name={user.name}
              subjects={user.subjects}
              year={user.year}
              rating={user.rating}
              role={user.role} // Pasar el rol para que se muestre correctamente
              onToggleRole={() => handleToggleRole(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
