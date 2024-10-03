const React = require('react');

const HistoryCard = ({ date, startHour, endHour, subject, onclick }) => {
  return (
    <tr className="session-item" onClick={onclick} style={{cursor: 'pointer'}}>
      <td>{subject}</td>
      <td>{date}</td>
      <td>{startHour} - {endHour}</td>
    </tr>
  );
};

export default HistoryCard;