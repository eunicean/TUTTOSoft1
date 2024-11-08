import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar.js';
// import Navbar from '../components/Navbar.js';
import baseUrl from '../../config.js';
import Modal from '../components/Modal.js';

import '../css/Sessions.css';
import '../css/Sidebar.css';
import '../css/Navbar.css';

function CreateSession({ isOpen, onClose }) {
    const [newSession, setNewSession] = useState({
        subject: '',
        date: '',
        startHour: '',
        endHour: '',
        mode: '',
        studentEmail: ''  
    });
    const [studentUsername, setStudentUsername] = useState(''); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [suggestions, setSuggestions] = useState([]); 
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setNewSession({ ...newSession, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchCourses = async () => {
            const token = localStorage.getItem('token');
            
            try {
                const response = await fetch('/api/courses', {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCourses(data);
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
        const search = e.target.value;
        setNewSession({ ...newSession, studentEmail: search });
    
        if (search.length > 2) {  // Comienza a buscar después de 2 caracteres
            try {
                const url = `/api/get-username-by-email?search=${search}`; 
                const token = localStorage.getItem('token');
                console.log('Endpoint /api/get-username-by-email was hit');

                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data); // Muestra las sugerencias obtenidas
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error('Error fetching student suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);  // Limpia las sugerencias si el input es muy corto
        }
    };
    

    const handleSuggestionClick = (email) => {
        setNewSession({ ...newSession, studentEmail: email });
        setSuggestions([]); // Oculta las sugerencias al seleccionar una
    };
    

    const submitNewSession = async () => {
        const token = localStorage.getItem('token');
        
        const url = `${baseUrl}/api/sessions/create`;

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
                setNewSession({ subject: '', date: new Date(), startHour: new Date(), endHour: new Date(), mode: '', studentEmail: '' });
                navigate('/sessions');
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
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="create-session-container">
                <h1>Crear Nueva Sesión</h1>
                <div className={`create-session-form  ${isSidebarOpen ? 'shifted' : ''}`}>
                    <p>Cursos:</p>
                    <select name="subject" value={newSession.subject} onChange={handleInputChange}>
                        <option value="">Selecciona un curso</option>
                        {courses.map(course => (
                            <option key={course.course_code} value={course.course_code}>{course.namecourse}</option>
                        ))}
                    </select>
    
                    <p>Fecha de la sesión:</p>
                    <input type="date" name="date" value={newSession.date} onChange={handleInputChange} />
    
                    <p>Hora de inicio:</p>
                    <input type="time" name="startHour" value={newSession.startHour} onChange={handleInputChange} />
    
                    <p>Hora de finalización:</p>
                    <input type="time" name="endHour" value={newSession.endHour} onChange={handleInputChange} />
    
                    <p>Modalidad:</p>
                    <select className="select-container" name="mode" value={newSession.mode} onChange={handleInputChange}>
                        <option value="">Selecciona la modalidad</option>
                        <option value="VIRTUAL">VIRTUAL</option>
                        <option value="PRESENCIAL">PRESENCIAL</option>
                        <option value="AMBOS">AMBOS</option>
                    </select>
    
                    <p>Estudiante que recibirá la tutoría:</p>
                    <div className="student-email-container">
                        <input 
                            name="studentEmail" 
                            value={newSession.studentEmail} 
                            onChange={handleEmailChange} 
                            placeholder="Nombre o correo del estudiante" 
                        />
                        {suggestions.length > 0 && (
                            <ul className="suggestions-dropdown">
                                {suggestions.map((student) => (
                                    <li 
                                        key={student.email} 
                                        onClick={() => handleSuggestionClick(student.email)}
                                    >
                                        {student.username} ({student.email})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
    
                    <button onClick={submitNewSession} disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Sesión'}
                    </button>
    
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </Modal>
    );    
}

export default CreateSession;
