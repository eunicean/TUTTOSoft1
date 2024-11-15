import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/Sidebar.css';
import '../css/Navbar.css';
import '../css/ProfileCard.css';
import ProfileAvatar from '../components/Imagen.js';
import baseUrl from '../../config.js';

function ProfileView() {
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null); // Estado para almacenar la imagen en base64
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

    // Callback para recibir la imagen desde ProfileAvatar
    const handleImageChange = (base64Image) => {
        setProfileImage(base64Image);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const url = `${baseUrl}/api/profile/update`;

        try {
            console.log("Imagen base64 lista para enviar:", profileImage);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user,profileImage)
            });

            const data = await response.json();
            if (data.success) {
                setEditing(false); 
            } else {
                throw new Error(data.message || 'Error al actualizar el perfil.');
            }
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            setError(error.message || 'Error al actualizar el perfil');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCancelation = () => {
        setEditing(false); 
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="profile-container">
                <div className="profile-card">
                    {editing ? (
                        <>
                            {/* Pasar el callback para actualizar la imagen */}
                            <ProfileAvatar onImageChange={handleImageChange} />
                            <input
                                name="username"
                                defaultValue={user.username}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleSave}>Guardar</button>
                            <button onClick={handleCancelation}>Cancelar</button>
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
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProfileView;
