import React from 'react';

const HistoryCard = ({ date, startHour, endHour, subject }) => {
  return (
    <div className="card">
      <p>Fecha: {date}</p>
      <p>Horario: {startHour} - {endHour}</p>  
      <p>Materia: {subject}</p>
    </div>
  );
};

export default HistoryCard;