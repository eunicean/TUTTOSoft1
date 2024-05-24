import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.js';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../css/Sidebar.css';
import '../css/Navbar.css';
import '../css/ProfileCard.css'; // Asegúrate de que el CSS para la tarjeta esté correctamente definido

function ProfileView() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem('token');
            const url = 'http://localhost:5000/profile';

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                } else {
                    throw new Error(data.message || 'Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError(error.message || 'Unknown error fetching profile');
            }
        }

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
        navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Controlar la apertura y cierre de la barra lateral
    const closeSidebar = () => setIsSidebarOpen(false); // Cerrar la barra lateral

    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <>
            <button className="menu-toggle" onClick={toggleSidebar}>{isSidebarOpen ? 'Cerrar' : 'Menú'}</button>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            <div className="profile-container">
                <div className="profile-card">
                    <h2>{user.username || 'Nombre no disponible'}</h2>
                    <p>Email: {user.email || 'Email no disponible'}</p>
                    <p>Tipo de Usuario: {user.typeuser === '1' ? 'Estudiante' : 'Tutor'}</p>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </div>
        </>
    );
}

export default ProfileView;
