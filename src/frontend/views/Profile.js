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
                    {editing ? (
                        <>
                            <input
                                name="username"
                                defaultValue={user.username}
                                onChange={handleInputChange}
                            />
                            {/* <input
                                name="email"
                                defaultValue={user.email}
                                onChange={handleInputChange}
                            /> */}
                            <button onClick={handleSave}>Guardar</button>
                        </>
                    ) : (
                        <>
                            <div className="profile-avatar"></div>
                            <h2>{user.username || 'Nombre de Estudiante'}</h2>
                            <p>2to año</p>
                            <p>Carnet {user.carnet || '22000'}</p>
                            <div className="tags">
                                <span>Habla poco</span>
                                <span>Organizado</span>
                                <span>Entiende rápido</span>
                            </div>
                            <div className="rating">
                                {[...Array(5)].map((star, index) => (
                                    <span key={index} className="star">&#9733;</span>
                                ))}
                            </div>
                            <button onClick={() => setEditing(true)}>Editar Perfil</button>
                            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                            <button onClick={() => console.log('Abrir ayuda')}>Ayuda</button>
                        </>
                    )}
                </div>
                <div className="comments-section">
                    <h3>Comentarios</h3>
                    <div className="comment">
                        <div className="tags">
                            <span>Platicador</span>
                            <span>Organizado</span>
                        </div>
                        <p>Gracias por la ayuda</p>
                    </div>
                    <div className="comment">
                        <div className="tags">
                            <span>Entiende rápido</span>
                        </div>
                        <p>Gracias por la ayuda</p>
                    </div>
                    <div className="comment">
                        <div className="tags">
                            <span>Habla poco</span>
                        </div>
                        <p>Gracias por la ayuda</p>
                    </div>
                    <div className="comment">
                        <div className="tags">
                            <span>Entiende rápido</span>
                        </div>
                        <p>Gracias por la ayuda</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileView;
