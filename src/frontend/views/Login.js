import React, { useState } from 'react';
import '../css/Login.css';
import Header from '../components/Header.js';
import Button from '../components/Button.js';
import Footer from '../components/Footer.js';
import { useNavigate } from 'react-router-dom'; 

// Custom Input Component
const Input = ({ type, placeholder, value, onChange }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const [error, setError] = useState(''); 

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with:', errorData);
        alert(`Login failed: ${errorData.message}`);
        return;
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token); // Guarda el token recibido en localStorage
      console.log('Login Successful:', data);
      navigate('/sessions'); // Navega a las sesiones tras un inicio de sesión exitoso
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: Unexpected error occurred.');
    }
  };

  return (
    <div>
      <Header title="Iniciar Sesión" />
      <div className='container' id='container'>
        <div className='form-container sign-in'>
          <form onSubmit={handleLogin}>
            <span id='Loginsuggestions'>Usa tu correo electrónico y contraseña para iniciar sesión</span>
            {error && <div className="messages--error">{error}</div>} {/* Error message display */}
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
