import React from 'react';

const SessionCard = ({ date, time, subject }) => {
  return (
    <div className="session-card">
      <p>Fecha: {date}</p>
      <p>Hora: {time}</p>
      <p>Materia: {subject}</p>
    </div>
  );
};

export default SessionCard;
