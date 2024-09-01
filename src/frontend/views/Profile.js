import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.js';
import '../css/Sidebar.css';
import '../css/Navbar.css';
import '../css/ProfileCard.css';

function ProfileView() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const url = 'http://localhost:5000/profile/update';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();
            if (data.success) {
                console.log('Perfil actualizado correctamente.');
                setEditing(false); // Desactiva el modo de edición después de guardar
            } else {
                throw new Error(data.message || 'Error al actualizar el perfil.');
            }
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            setError(error.message || 'Error al actualizar el perfil');
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
        navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <button className="menu-toggle" onClick={toggleSidebar}>{isSidebarOpen ? 'Cerrar' : 'Menú'}</button>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-avatar"></div>
                    <h2>{user.username || 'tutotest'}</h2>
                    <p>{user.year || '2to año'}</p>
                    <p>{user.carnet || 'Carnet 22000'}</p>

                    <div className="button-group">
                        <button className="edit-button" onClick={() => setEditing(true)}>Editar Perfil</button>
                        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                        <button className="help-button" onClick={() => console.log('Abrir ayuda')}>Ayuda</button>
                    </div>
                </div>
                
            </div>
        </>
    );
}

export default ProfileView;
