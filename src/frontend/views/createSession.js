import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, TimePicker } from '@material-ui/pickers'; // Importar los componentes de Material-UI
import '../css/Sessions.css';
import '../css/Seachtutor.css'; 

function CreateSession() {
    const [newSession, setNewSession] = useState({
        subject: '',
        date: new Date(), // Cambia el formato a Date para los selectores
        startHour: new Date(),
        endHour: new Date(),
        mode: '',
        studentEmail: '' 
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

    const handleDateChange = (date) => {
        setNewSession({ ...newSession, date });
    };

    const handleStartHourChange = (startHour) => {
        setNewSession({ ...newSession, startHour });
    };

    const handleEndHourChange = (endHour) => {
        setNewSession({ ...newSession, endHour });
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('https://209.126.125.63/api/courses');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCourses(Array.isArray(data) ? data : []);
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
                const response = await fetch(`https://209.126.125.63/api/get-username-by-email?email=${email}`);
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
        const url = 'https://209.126.125.63/api/sessions/create';
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
        <div className='outer-container-create'>
            <div className={`sessions-container-create`}>
                <h1>Crear Nueva Sesión</h1>
                <div className={`create-session-form ${isSidebarOpen ? 'shifted' : ''}`}>
                    <h4>Cursos:</h4>
                    <select name="subject" value={newSession.subject} onChange={handleInputChange}>
                        <option value="">Selecciona un curso</option>
                        {courses.map(course => (
                            <option key={course.course_code} value={course.course_code}>{course.namecourse}</option>
                        ))}
                    </select>
                    <h4>Fecha de la sesión:</h4>
                    <DatePicker value={newSession.date} onChange={handleDateChange} />
                    <h4>Hora de inicio:</h4>
                    <TimePicker value={newSession.startHour} onChange={handleStartHourChange} />
                    <h4>Hora de finalización:</h4>
                    <TimePicker value={newSession.endHour} onChange={handleEndHourChange} />
                    <h4>Modalidad:</h4>
                    <select name="mode" value={newSession.mode} onChange={handleInputChange}>
                        <option value="">Selecciona la modalidad</option>
                        <option value="VIRTUAL">VIRTUAL</option>
                        <option value="PRESENCIAL">PRESENCIAL</option>
                        <option value="AMBOS">AMBOS</option>
                    </select>
                    <h4>Estudiante que recibirá la tutoría:</h4>
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
        </div>
    );
}

export default CreateSession;
