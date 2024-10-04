import React, { createContext, useState } from 'react';

// Crear el contexto
export const UserContext = createContext(null);

// Componente proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userType: 'student', // 'tutor'
    username: 'Nombre de Usuario',
    // otros datos relevantes del usuario
  });

  // El valor que será accesible a todos los componentes anidados
  const contextValue = {
    user,
    setUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

