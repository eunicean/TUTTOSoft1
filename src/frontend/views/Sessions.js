import React, { useState, useEffect } from 'react';
import SessionCard from '../components/Card.js';
import Sidebar from '../components/Sidebar.js';
import Navbar from '../components/Navbar.js';
import '../css/Sessions.css';
import '../css/Sidebar.css';
import '../css/Navbar.css';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [periodo, setPeriodo] = useState('');

  const handlePeriodChange = (e) => {
    setPeriodo(e.target.value);
  };

  const fetchSessions = async (queryPeriodo = '') => {
    setLoading(true);
    setError(null); // Limpiar errores anteriores
    const token = localStorage.getItem('token');
    const url = new URL('http://localhost:3001/sessions');

    if (queryPeriodo) {
      url.searchParams.append('periodo', queryPeriodo);
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const transformedSessions = data.sessions.map((session) => ({
        id: session.id,
        date: new Date(session.dated).toLocaleDateString('es-ES'),
        time: `${session.start_hour} - ${session.end_hour}`,
        subject: `Curso: ${session.course_code}`,
      }));
      setSessions(transformedSessions);
    } catch (error) {
      console.error("Could not fetch sessions:", error);
      setError(`Failed to fetch sessions: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();  // Carga inicial sin filtros
  }, []);

  useEffect(() => {
    fetchSessions(periodo);  // Carga en cada cambio de 'periodo'
  }, [periodo]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (loading) return <div className="loading-message">Cargando...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <Navbar />
      <div className={`sessions-container ${isSidebarOpen ? 'shifted' : ''}`}>
        <button className="menu-toggle" onClick={toggleSidebar}>Menu</button>
        <h1 className="sessions-title">Próximas Sesiones</h1>
        <div className="session-filters">
          <label htmlFor="periodo-select">Elige el periodo:</label>
          <select id="periodo-select" value={periodo} onChange={handlePeriodChange} className="periodo-selector">
            <option value="">Todas las Sesiones</option>
            <option value="manana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>
        </div>
        <div className='yes-sessions'>
          {sessions.length > 0 ? (
            sessions.map(session => (
              <SessionCard
                key={session.id}
                date={session.date}
                time={session.time}
                subject={session.subject}
              />
            ))
          ) : (
            <div className="no-sessions">No hay sesiones disponibles.</div>
          )}
        </div>
      </div>  
    </>
  );
}

export default Sessions;
