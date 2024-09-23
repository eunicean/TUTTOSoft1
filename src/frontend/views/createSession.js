import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';


import '../css/Sessions.css';
import '../css/Sidebar.css';
import '../css/Navbar.css';

function CreateSession() {
    const [newSession, setNewSession] = useState({
        subject: '',
        date: '',
        startHour: '',
        endHour: '',
        mode: '',
        studentEmail: ''  // Añadir campo de correo electrónico del estudiante
    });
    const [studentUsername, setStudentUsername] = useState(''); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setNewSession({ ...newSession, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/courses');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCourses(data);
                    console.log(setCourses)
                } else {
                    throw new Error('Data is not an array');
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
                setError('Failed to load courses');
            }
        };
        fetchCourses();
    }, []);
    
    

    const handleEmailChange = async (e) => {
        const email = e.target.value;
        setNewSession({ ...newSession, studentEmail: email });

        if (email) {
            try {
                const response = await fetch(`http://localhost:5000/get-username-by-email?email=${email}`);
                if (response.ok) {
                    const data = await response.json();
                    setStudentUsername(data.username || 'Usuario no encontrado');
                } else {
                    setStudentUsername('Usuario no encontrado');
                }
            } catch (error) {
                console.error('Error fetching student username:', error);
                setStudentUsername('Error fetching usuario');
            }
        } else {
            setStudentUsername('');
        }
    };


    const submitNewSession = async () => {
        const token = localStorage.getItem('token');
        const url = 'http://localhost:5000/sessions/create';
        setLoading(true);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSession),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setNewSession({ subject: '', date: '', startHour: '', endHour: '', mode: '', studentEmail: '' });
                navigate('/sessions'); // Navega de vuelta a la vista de sesiones
            } else {
                throw new Error(data.message || 'Failed to create session');
            }
        } catch (error) {
            console.error("Could not create session:", error);
            setError(`Failed to create session: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-session-container">
            {/* <Navbar /> */}
            <h1>Crear Nueva Sesión</h1>
            <div className={`create-session-form  ${isSidebarOpen ? 'shifted' : ''}`}>
                <select name="subject" value={newSession.subject} onChange={handleInputChange}>
                    <option value="">Selecciona un curso</option>
                    {courses.map(course => (
                        <option key={course.course_code} value={course.course_code}>{course.namecourse}</option>
                    ))}
                </select>
                <input type="date" name="date" value={newSession.date} onChange={handleInputChange} />
                <input type="time" name="startHour" value={newSession.startHour} onChange={handleInputChange} />
                <input type="time" name="endHour" value={newSession.endHour} onChange={handleInputChange} />
                <select className="select-container" name="mode" value={newSession.mode} onChange={handleInputChange}>
                    <option value="">Selecciona la modalidad</option>
                    <option value="VIRTUAL">VIRTUAL</option>
                    <option value="PRESENCIAL">PRESENCIAL</option>
                    <option value="AMBOS">AMBOS</option>
                </select>
                <div className="student-email-container">
                    <input 
                        name="studentEmail" 
                        value={newSession.studentEmail} 
                        onChange={handleEmailChange} 
                        placeholder="Correo del estudiante" 
                    />
                    <span>{studentUsername}</span>
                </div>
                <button onClick={submitNewSession} disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Sesión'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default CreateSession;
