import React, { useState } from 'react';
import { DataProvider, useData } from '../components/DataProvider.js';
import UserList from '../components/UserList.js';
import '../css/AdminSearch.css';

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

const AdminPageContent = () => {
  const { users, toggleUserRole } = useData();
  const [viewTutors, setViewTutors] = useState(true); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedSubject, setSelectedSubject] = useState(''); 

  const toggleView = () => setViewTutors(!viewTutors);

  const handleToggleRole = (userIndex) => {
    toggleUserRole(userIndex); 
    setViewTutors(prevViewTutors => !prevViewTutors); 
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = viewTutors ? user.role === 'tutor' : user.role === 'estudiante';
    const matchesSubject = selectedSubject === '' || (user.subjects && user.subjects.includes(selectedSubject));
    const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.subjects && user.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      user.year.toString().includes(searchTerm);

    return matchesRole && matchesSubject && matchesSearchTerm;
  });

  return (
    <div className="outer-container-adminSea">
      <div className="sessions-container-adminSea">
        <div className="admin-page">
          <div className={`header ${viewTutors ? 'tutors-header' : 'students-header'}`}>
            <h1>{viewTutors ? 'Buscar Tutor' : 'Buscar Estudiante'}</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Nombre, materia"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {/* Mostrar el desplegable solo si estamos en la vista de "Buscar Tutor" */}
              {viewTutors && (
                <FilterDropdown selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
              )}
            </div>
            <div className="toggle-container">
              <label>Buscar Estudiantes</label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="toggleView"
                  checked={viewTutors}
                  onChange={toggleView}
                />
                <label className="custom-checkbox" htmlFor="toggleView"></label>
              </div>
              <label>Buscar Tutores</label>
            </div>
          </div>
          <UserList users={filteredUsers} viewTutors={viewTutors} onToggleRole={handleToggleRole} />
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => (
  <DataProvider>
    <AdminPageContent />
  </DataProvider>
);

export default AdminPage;
