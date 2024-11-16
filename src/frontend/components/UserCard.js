import React from 'react';
import ProfilePicture from '../components/profilePicture.js';

const UserCard = ({ name, subjects, rating, role, onToggleRole, viewTutors, avatarUrl }) => {
  return (
    <div className="user-card">
      <div className="user-info">
        <ProfilePicture></ProfilePicture>
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
            <p>(Estudiante)</p>
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
