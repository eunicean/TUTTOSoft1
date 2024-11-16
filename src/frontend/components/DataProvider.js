import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([
    { name: 'tuto test', role: 'tutor', subjects: ['Física I', 'Historia Universal',' Matemáticas Básicas',' Programación I'], year: 2, rating: 4 },
    { name: 'tutotes2', role: 'tutor', subjects: [' Matemáticas Básicas'], year: 3, rating: 5 },
    { name: 'Marta Hernández', role: 'estudiante', subjects: [], year: 2, rating: 3 },
    { name: 'Luis Gómez', role: 'estudiante', subjects: [], year: 4, rating: 2 },
    { name: 'María Díaz', role: 'estudiante', subjects: [], year: 3, rating: 5 },
    { name: 'Ricardo Sánchez', role: 'estudiante', subjects: [], year: 1, rating: 4 },
    { name: 'Carlos García', role: 'estudiante', subjects: [], year: 1, rating: 0 },
    { name: 'Sofía Martínez', role: 'estudiante', subjects: [], year: 4, rating: 0 },
    { name: 'Lucía Gómez', role: 'estudiante', subjects: [], year: 2, rating: 0 },
    { name: 'Pedro Fernández', role: 'estudiante', subjects: [], year: 3, rating: 0 },
    { name: 'Jorge Ruiz', role: 'estudiante', subjects: [], year: 2, rating: 0 },
    { name: 'Elena Torres', role: 'estudiante', subjects: [], year: 1, rating: 0 },
  ]);

  const toggleUserRole = (index) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[index].role = updatedUsers[index].role === 'tutor' ? 'estudiante' : 'tutor';
      return updatedUsers;
    });
  };

  return (
    <DataContext.Provider value={{ users, toggleUserRole }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
