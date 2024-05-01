import React, { useState } from 'react';
import './Login.css'; // Reutilizando el mismo archivo CSS para mantener la coherencia

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); // O el valor predeterminado que desees
  const [error, setError] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    console.log('Registrando', { email, password, role });
    // Aquí se añadiría la lógica para enviar los datos al servidor
  };

  return (
    <div className="container">
      <div className="form-container sign-in">
        <form onSubmit={handleRegister}>
          <span id='Loginsuggestions'>Usa tu correo electrónico y contraseña para registrarte</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Contraseña"
            required
          />
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
            <option value="student">Estudiante</option>
            <option value="tutor">Tutor</option>
          </select>
          <button type="submit" className="boton-registrarse">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
