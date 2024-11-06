import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import AppRouter from './frontend/routes/AppRouter.js';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from 'date-fns/locale/es/index.js'; // Añadir .js al final

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
<React.StrictMode>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
        <AppRouter /> {/* Aquí se renderizan todas las rutas */}
      </MuiPickersUtilsProvider>
  </React.StrictMode>
);