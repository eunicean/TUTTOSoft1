const React = require('react');

const SessionCard = ({ date, startHour, endHour, subject }) => {
  return (
    <div className="session-card">
      <p>Fecha: {date}</p>
      <p>Horario: {startHour} - {endHour}</p>  
      <p>Materia: {subject}</p>
    </div>
  );
};

export default SessionCard;
