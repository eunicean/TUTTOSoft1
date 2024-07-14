import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../views/Login.js';
import Sessions from '../views/Sessions.js';
import Register from '../views/Register.js';
import Profile from '../views/Profile.js';
import TestingView from '../views/testingView.js';
import CancelView from '../views/CancelView.js';

import '../css/Register.css';


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sessions-info/:sessionId" element={<TestingView />} />
        <Route path="/cancel-session" element={<CancelView />} />
        {/* Más rutas pueden ser agregadas aquí */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
