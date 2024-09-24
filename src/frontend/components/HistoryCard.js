import React from 'react';

const HistoryCard = ({ date, startHour, endHour, subject }) => {
  return (
    <tr className="session-item">
      <td>{subject}</td>
      <td>{date}</td>
      <td>{startHour} - {endHour}</td>
    </tr>
  );
};

export default HistoryCard;
