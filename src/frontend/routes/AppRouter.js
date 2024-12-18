import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../views/Login.js';
import Sessions from '../views/Sessions.js';
import Register from '../views/Register.js';
import Profile from '../views/Profile.js';
// import TestingView from '../views/testingView.js';
import CancelView from '../views/CancelView.js';
import CreateSession from '../views/createSession.js';
import SessionVistaParaTutor from '../views/SessionVistaParaTutor.js';
// import TestingHeader from '../views/VistaDePruebaHeader.js';
import SessionsHistory from '../views/SessionsHistory.js';
import Absence from '../views/Absence.js';
import Searchtutor from '../views/Searchtutor.js';
import SessionVistaParaEstudiante from '../views/SessionVistaParaEstudiante.js';
import Chat from '../views/Chat.js'; // Importa el componente de Chat
import RateTutorView from '../views/RateTutorView.js';
import AdminSearch from '../views/AdminSearch.js';
import AdminTutor from '../views/AdminTutor.js';
import ReportList from '../views/ReportList.js';
import ReportDetails from '../views/ReportDetails.js'; // Ajusta la ruta según sea necesario

import '../css/Register.css';
import '../css/Router.css';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/HeaderGeneral.js';

const AppContent = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const excludedHeaderRoutes = ['/login', '/', '/register']; // Rutas donde no quieres mostrar el Header
  return (
    <>
      {!excludedHeaderRoutes.includes(location.pathname) && (
        <>
          <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
        </>
      )}
      <div className={`app-content ${isSidebarOpen ? 'shifted' : ''}`} style={{ marginTop: isSidebarOpen ? '80px' : '60px' }}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/DetallesTutor/:sessionId' element={<SessionVistaParaTutor />} />
          <Route path="/cancel-session/:sessionId" element={<CancelView />} />
          <Route path="/sessions/create" element={<CreateSession />} />
          <Route path='/sessions-history' element={<SessionsHistory />} />
          <Route path='/absence/:sessionId' element={<Absence />} />
          {/* <Route path='/tutorprofile' element={<TutorPro  file />} /> */}
          <Route path='/seachtutor' element={<Searchtutor />} />
          <Route path='/adminsearch' element={<AdminSearch />} />
          <Route path='/admintutor' element={<AdminTutor />} />
          <Route path='/DetalleEstudiante/:sessionId' element ={<SessionVistaParaEstudiante />} />
          <Route path='/chat' element={<Chat />} /> {/* Nueva ruta para el Chat */}
          <Route path="/rate-tutor/:sessionId" element={<RateTutorView />}  />
          <Route path="/report/:tutorId" element={<ReportDetails />} />  {/* Ruta para los detalles del reporte */}
          <Route path="/reportlist" element={<ReportList />} />
        </Routes>
      </div>
    </>
  );
};

const AppRouter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <AppContent isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </BrowserRouter>
  );
};

export default AppRouter;
