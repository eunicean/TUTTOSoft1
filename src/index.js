import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Asegúrate de tener un archivo CSS si lo necesitas
import AppRouter from './frontend/routes/AppRouter';
import reportWebVitals from './frontend/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

