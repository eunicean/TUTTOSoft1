import React, { useState } from 'react';
import './Login.css'; // mantener el mismo diseño que el login

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    console.log('Registrando', { email, password, role });
    // Implementa aquí tu lógica para enviar los datos al servidor
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Contraseña"
            required
          />
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Mostrar Contraseña
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
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
