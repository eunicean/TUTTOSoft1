import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.js';
import StudentProfile from '../components/StudentProfile.js';
import TutorProfile from '../components/TutorProfile.js';
import AdminProfile from '../components/AdminProfile.js';
import '../css/Sidebar.css';
import '../css/Navbar.css';

function ProfileView() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userType, setUserType] = useState(null);
    const [error, setError] = useState(null);

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
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success) {
                    setUserType(data.typeuser);  // Asegúrate de usar la propiedad correcta
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

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    if (error) return <div>Error: {error}</div>;

    let content;
    console.log(userType);
    switch (userType) {
        case '1':
            content = <StudentProfile />;
            break;
        case '2':
            content = <TutorProfile />;
            break;
        
        default:
            content = <div>No se ha encontrado información de usuario.</div>;
    }

    return (
        <>
            <button className="menu-toggle" onClick={toggleSidebar}>Menu</button>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            <div className="profile-container">
                {content}
            </div>
        </>
    );
}

export default ProfileView;
