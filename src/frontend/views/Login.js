import React, { useState } from 'react';
import './Login.css';
import Header from './components/Header.js';
import Button from './components/Button.js';
import Footer from './components/Footer.js';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

// Custom Input Component
const Input = ({ type, placeholder, value, onChange }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para manejar la navegación

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Attempting to login with:", { email, password });

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
      console.log('Login Successful:', data);
      alert('Login Successful!');
      // Aquí podrías redirigir a otra página al iniciar sesión exitosamente
      // navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: Unexpected error occurred.');
    }
  };

  // Redirigir a la vista de registro
  const redirectToRegister = () => {
    navigate('/register'); // Cambia al componente de registro
  };

  return (
    <div>
      <Header title="Iniciar Sesión" />
      <div className='container' id='container'>
        <div className='form-container sign-in'>
          <form onSubmit={handleLogin}>
            <span id='Loginsuggestions'>Usa tu correo electrónico y contraseña para iniciar sesión</span>
            <Input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} />
            <Input type="password" placeholder="Ingresa tu contraseña" value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit">Iniciar Sesión</Button>
            <button onClick={redirectToRegister} className="toggle-view">Registrarse</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
