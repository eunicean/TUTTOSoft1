import UserCard from './UserCard'; // Ajusta la ruta según sea necesario

const UsersContainer = ({ users, viewTutors, handleToggleRole }) => {
  return (
    <div className="users-container">
      {users.map((user, index) => (
        <UserCard
          key={index}
          name={user.name}
          subjects={user.subjects}
          year={user.year}
          rating={user.rating}
          role={user.role}
          viewTutors={viewTutors}
          onToggleRole={() => handleToggleRole(index)}
        />
      ))}
    </div>
  );
};

export default UsersContainer;
