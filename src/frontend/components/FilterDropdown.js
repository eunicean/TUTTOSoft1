// src/frontend/components/FilterDropdown.js

import React, { useState, useEffect } from 'react';

const FilterDropdown = ({ selectedSubject, setSelectedSubject }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/courses');
        const data = await response.json();
        setCourses(data); // Guardar los cursos obtenidos
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();  // Llamar a la API cuando se cargue el componente
  }, []);

  return (
    <select
      value={selectedSubject}
      onChange={(e) => setSelectedSubject(e.target.value)}
      className="filter-dropdown"
    >
      <option value="">Seleccionar materia</option>
      {courses.map((course) => (
        <option key={course.course_code} value={course.namecourse}>
          {course.namecourse}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;

