import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../views/Login.js';
import PaginaPrincipal from '../views/PaginaPrincipal.js';


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Principal" element ={<PaginaPrincipal />} />
        {/* Más rutas pueden ser agregadas aquí */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;