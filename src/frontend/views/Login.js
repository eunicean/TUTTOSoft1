import React, { useState } from 'react';
import '../css/Login.css';
import Header from '../components/Header.js';
import Button from '../components/Button.js';
import Footer from '../components/Footer.js';
import { useNavigate } from 'react-router-dom'; 
import baseUrl from '../../config.js';

// Componente de Entrada personalizado
const Input = ({ type, placeholder, value, onChange }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para manejar mensajes de error
  const navigate = useNavigate(); // Hook para la navegación

  const handleLogin = async (event) => {
    event.preventDefault();

    // Validar campos vacíos
    if (!email || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    try {
      
      const url = `${baseUrl}/api/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Respuesta del servidor:', errorData);

        // Mostrar mensaje de error actualizado
        if (errorData.message === 'Invalid user') {
          setErrorMessage('Usuario inexistente.');
        } else if (errorData.message === 'Invalid password') {
          setErrorMessage('Contraseña incorrecta.');
        } else {
          setErrorMessage('Error de inicio de sesión: ' + errorData.message);
        }
        return;
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token); // Guarda el token recibido en localStorage
      console.log('Inicio de sesión exitoso:', data);
      navigate('/sessions'); // Navega a las sesiones tras un inicio de sesión exitoso
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setErrorMessage('Error de inicio de sesión: Ocurrió un error inesperado.');
    }
  };

  return (
    <div>
      <Header title="Iniciar Sesión" />
      <div className='container' id='container'>
        <div className='form-container sign-in'>
          <form onSubmit={handleLogin}>
            <span id='Loginsuggestions'>Usa tu correo electrónico y contraseña para iniciar sesión</span>
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Cuadro de texto para mensajes de error */}
            <Input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} />
            <Input type="password" placeholder="Ingresa tu contraseña" value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit">Iniciar Sesión</Button>
            <Button onClick={() => navigate('/register')} className="toggle-view">Registrarse</Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
