import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../views/Login.js';
import Sessions from '../views/Sessions.js';
import Register from '../views/Register.js';
import Profile from '../views/Profile.js';
import TestingView from '../views/testingView.js';
import CancelView from '../views/CancelView.js';
import CreateSession from '../views/createSession.js';
import TutorProfile from '../views/TutorProfile.js';
import SessionVistaParaTutor from '../views/SessionVistaParaTutor.js';
import TestingHeader from '../views/VistaDePruebaHeader.js';
import SessionsHistory from '../views/SessionsHistory.js';
import Absence from '../views/Absence.js';

import '../css/Register.css';
import '../css/Router.css';

import Sidebar from '../components/Sidebar.js';
import Header from '../components/HeaderGeneral.js';

const AppContent = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const excludedHeaderRoutes = ['/login', '/']; // Rutas donde no quieres mostrar el Header

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
          <Route path="/cancel-session/:sessionId" element={<CancelView />} />
          <Route path="/sessions/create" element={<CreateSession />} />
          <Route path='/SessionVistaEstudiante/:sessionId' element={<SessionVistaParaTutor />} />
          <Route path='/sessions-history' element={<SessionsHistory />} />
          <Route path='/absence' element={<Absence />} />
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
