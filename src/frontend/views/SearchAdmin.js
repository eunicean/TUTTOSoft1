import React, { useState, useEffect } from 'react';
import '../css/SearchAdmin.css'; // Asegúrate de ajustar estilos como prefieras

const UserCard = ({ name, role, subjects, year, onToggleRole }) => {
    return (
      <div className="user-card">
        <div className="user-info">
          <div className="avatar-placeholder"></div>
          <div>
            <h4>{name}</h4>
            <p>{role === 'tutor' ? 'Tutor' : 'Estudiante'}</p>
            {role === 'tutor' && <p>{subjects.join(', ')}</p>}
            <p>{year} año</p>
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
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:5000/users');
          const data = await response.json();
  
          const formattedUsers = data.map(user => ({
            name: user.username,
            role: user.role,
            subjects: user.courses ? user.courses.split(', ') : [],
            year: user.year || 1,
          }));
          setUsers(formattedUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      fetchUsers();
    }, []);
  
    const filteredUsers = users.filter(user => {
      const matchesRole = viewTutors ? user.role === 'tutor' : user.role === 'estudiante';
      const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.year.toString().includes(searchTerm);
  
      return matchesRole && matchesSearchTerm;
    });
  
    return (
      <div className="admin-page">
        <div className="header">
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
                role={user.role}
                subjects={user.role === 'tutor' ? user.subjects : []} // Solo mostrar materias si es tutor
                year={user.year}
                onToggleRole={() => handleToggleRole(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminPage;