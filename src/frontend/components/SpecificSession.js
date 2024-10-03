const React = require('react');

const SpecificSession = ({ date, startHour, endHour, subject, tutorName, studentName }) => {
  return (
    <div className="session-card">
      <p>Fecha: {date}</p>
      <p>Horario: {startHour} - {endHour}</p>  
      <p>Materia: {subject}</p>
      <p>Tutor: {tutorName}</p>
      <p>Estudiante: {studentName}</p>
    </div>
  );
};

export default SpecificSession;
