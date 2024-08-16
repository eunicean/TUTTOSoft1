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

import '../css/Register.css';

import Sidebar from '../components/Sidebar.js';
import Header from '../components/HeaderGeneral.js';

const AppRouter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const excludedHeaderRoutes = ['/login','/']; // Rutas donde no quieres mostrar el Header

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <BrowserRouter>
        <div>
          {!excludedHeaderRoutes.includes(window.location.pathname) && (
       <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> )}
        <Sidebar isOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
      </div>
      <div style={{ marginTop: isSidebarOpen ? '80px' : '60px' }}>
        {/* Ajusta el margen superior para que no se oculte el contenido detrás del Header */}
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/sessions-info/:sessionId" element={<TestingView />} /> */}
        <Route path="/cancel-session/:sessionId" element={<CancelView />} />
        <Route path="/sessions/create" element={<CreateSession />} />
        <Route path='/TutorProfile' element={<TutorProfile />} />
        <Route path='/SessionVistaEstudiante/:sessionId' element={<SessionVistaParaTutor />} />
        <Route path='/TestingHeader' element ={<TestingHeader/>} />
        {/* Más rutas pueden ser agregadas aquí */}
      </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
