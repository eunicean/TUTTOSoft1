import React from 'react';
import HeaderYmenu from './components/HeaderYmenu.js';
import Horario from './components/SlideHorario.js';
import Button from './components/Button.js';
const PaginaPrincipal = () => {
  const EstilosDivTarjetas = {
    display: 'flex', 
    justifyContent: 'center', 
    marginTop: '20px', 
    flexDirection: 'column' 
  }
  const DivTarjetas = {
    backgroundColor: '#C19A6B', 
    color: 'white', 
    padding: '20px', 
    borderRadius: '10px', 
    maxWidth: '3000px', 
    margin: '0 10px',
    width: '100vh', 
    marginTop :'2vh'
  }
  const Principal = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  }
  const titulo = {
    display: 'flex',
    //justifyContent: 'space-between',
    // alignItems: 'center',
    padding: '20px', // Ajusta el padding según sea necesario
    backgroundColor: '#f0f0f0', // Ajusta el color de fondo según sea necesario
    width: '100%'
  }
  const boton = {
    position: 'absolute',
      right: '35vh', // Ubica el botón a 10vh del margen derecho de la pantall
  }
  const sesiones ={
    display: 'flex'
  }
  return (
    <div style={Principal}>
      <HeaderYmenu />

    <div style={titulo}>
      <h1 style={{ position: 'relative', fontSize:'7vh', fontFamily: 'arial', color: '#8E6B3A', marginLeft:'10vh'}}> Sesiones proximas</h1>
      <div style={boton}>
      <Button> Ir a chat </Button>
      </div>
    </div>

    <div style={sesiones}>
      <h3> Horario:</h3>
      <Horario />s
      </div>

      <div style={EstilosDivTarjetas}> 
        <div style={DivTarjetas}>
          <h3>Tutoría de Matemáticas</h3>
          <p>Mañana a las 10:00 AM</p>
          <p>Tutor: Juan Pérez</p>
        </div>
        <div style={DivTarjetas}>
          <h3>Tutoría de Física</h3>
          <p>Tarde a las 3:00 PM</p>
          <p>Tutor: María García</p>
        </div>
        <div style={DivTarjetas}>
          <h3>Tutoría de Historia</h3>
          <p>Noche a las 8:00 PM</p>
          <p>Tutor: Carlos López</p>
        </div>
      </div>
      </div>
  );
}

export default PaginaPrincipal;
