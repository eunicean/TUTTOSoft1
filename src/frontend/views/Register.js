import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import Button from '../components/Button.js';
import Footer from '../components/Footer.js';

import '../css/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');

    try {
      const baseUrl = process.env.REACT_APP_API_URL || '';
      const url = `${baseUrl}/api/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });

      const data = await response.json();

      if (data.success) {
        alert('Registro exitoso');
        // Utilizar setTimeOut para asegurarse de que la vista se actualice correctamente
        setTimeout(() => navigate('/login'), 100); // Retrasa la navegación para dar tiempo a las actualizaciones de estado
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setError('Hubo un problema al registrar al usuario. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div>
      <Header title="Registro" />
      <div className="register-container">
        <form onSubmit={handleRegister}>
          <span>Usa tu correo electrónico UVG</span>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          {/* <div className="select-container">
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
            </select>
          </div> */}
          {error && <span className="error">{error}</span>}
          <Button type="submit">Register</Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
