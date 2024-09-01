import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import AppRouter from './frontend/routes/AppRouter.js';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
<React.StrictMode>
        <AppRouter /> {/* Aquí se renderizan todas las rutas */}
  </React.StrictMode>
);