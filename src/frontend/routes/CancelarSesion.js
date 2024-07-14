import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CancelarCita from '../views/CancelarCita';
import PaginaPrincipal from '../views/PaginaPrincipal'; // Asegúrate de tener importado el componente PaginaPrincipal u otros componentes necesarios

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/cancelar-cita" component={CancelarCita} />
        <Route path="/" component={PaginaPrincipal} />
      </Switch>
    </Router>
  );
}

export default AppRouter;
