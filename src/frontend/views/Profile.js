import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../css/Sidebar.css';
import '../css/Navbar.css';
import '../css/ProfileCard.css';
import baseUrl from '../../config.js';

function ProfileView() {
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem('token');
            
            const url = `${baseUrl}/api/profile`;

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
        
        const url = `${baseUrl}/api/profile/update`;

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
                // console.log('Perfil actualizado correctamente.');
                setEditing(false); // Desactiva el modo de edición después de guardar
            } else {
                throw new Error(data.message || 'Error al actualizar el perfil.');
            }
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            setError(error.message || 'Error al actualizar el perfil');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
        navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="profile-container">
                <div className="profile-card">
                    {editing ? (
                        <>
                            <input
                                name="username"
                                defaultValue={user.username}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleSave}>Guardar</button>
                        </>
                    ) : (
                        <>  
                            <div className="profile-avatar"></div>
                            <h2>{user.username || 'Nombre no disponible'}</h2>
                            <p>Email: {user.email || 'Email no disponible'}</p>
                            <p>
                                Tipo de Usuario: {user.typeuser === '1' ? 'Estudiante' : user.typeuser === '2' ? 'Tutor' : 'Admin'}
                            </p>

                            {user.typeuser === '2' && (
                                <div>
                                    <p>Cursos Impartidos:</p>
                                    <ul>
                                        {user.specialties && user.specialties.length > 0 ? (
                                            user.specialties.map((specialty) => (
                                                <li key={specialty.course_code}>
                                                    {specialty.course_name}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No tiene cursos asignados.</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            <button onClick={() => setEditing(true)}>Editar Perfil</button>
                        </>
                    )}
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                    <button onClick={() => console.log('Abrir ayuda')}>Ayuda</button>
                </div>
            </div>
        </>
    );
}

export default ProfileView;
