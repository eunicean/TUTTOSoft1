import React from 'react';
import UserCard from './UserCard.js';

const UserList = ({ users, viewTutors, onToggleRole }) => {
  const filteredUsers = users.filter(user => viewTutors ? user.role === 'tutor' : user.role === 'estudiante');

  return (
    <div className="users-list">
      {filteredUsers.map((user, index) => (
        <UserCard
          key={index}
          name={user.name}
          subjects={user.subjects}
          year={user.year}
          rating={user.rating}
          role={user.role}
          onToggleRole={() => onToggleRole(index)}
          viewTutors={viewTutors}
        />
      ))}
    </div>
  );
};

export default UserList;
