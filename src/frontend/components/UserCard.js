import React from 'react';

const UserCard = ({ name, subjects, rating, role, onToggleRole, viewTutors }) => {
  return (
    <div className="user-card">
      <div className="user-info">
        <div className="avatar-placeholder"></div>
        <div>
          <h4>{name}</h4>
          {role === 'tutor' ? (
            <>
              <h4>{subjects.join(', ')}</h4> {/* Mostrar materias solo para tutores */}
              <div className="stars-admin">
                {'★'.repeat(rating) + '☆'.repeat(5 - rating)} {/* Mostrar calificación */}
              </div>
            </>
          ) : (
            <p> (Estudiante)</p>
          )}
        </div>
      </div>
      <button onClick={onToggleRole}>
        {viewTutors ? 'Cambiar a Estudiante' : 'Cambiar a Tutor'}
      </button>
    </div>
  );
};

export default UserCard;
