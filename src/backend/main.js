import express from 'express'
import cors from 'cors'
import {
  verificarUsuario,
  crearUsuario,
  obtenerTipoUsuarioPorId,
  obtenerSesionesPlanificadasPorPersona
}from './db.js'

const app = express()
const port = 5000

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));


app.get('/', (req, res) => {
  res.send('Hello World! This is TuTTo')
})

app.get('/users/login', async (req, res) => {
  const { email, constrasenia } = req.query; // Obtener los datos de la consulta
  try {
    const isValidUser = await verificarUsuario(email, constrasenia);
    if (isValidUser) {
      res.status(200).json({ message: 'User authenticated successfully' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/users/register', async (req, res) => {
  const { id, username, email, password } = req.query;
  try {
    const success = await crearUsuario(id, username, email, password); 
    if (success) {
      res.status(201).json({ message: 'User registered successfully' });
    } else {
        res.status(400).json({ error: 'Failed to register user' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});

// Endpoint para obtener el tipo de usuario por ID
app.get('/users/type', async (req, res) => {
  const { userId } = req.query; // Obtén el ID del usuario de la consulta
  try {
    const tipoUsuario = await obtenerTipoUsuarioPorId(userId); // Llama a la función obtenerTipoUsuarioPorId con el ID recibido
    if (tipoUsuario) {
      res.status(200).json({ tipoUsuario }); // Devuelve el tipo de usuario encontrado
    } else {
      res.status(404).json({ error: 'User not found' }); // Devuelve un error si el usuario no se encuentra
    }
  } catch (error) {
    console.error('Error obtaining user type:', error);
    res.status(500).json({ error: 'Internal server error' }); // Devuelve un error en caso de error interno del servidor
  }
});

// Endpoint para obtener las sesiones planificadas por persona
app.get('/users/sessions', async (req, res) => {
  const { userId } = req.query; // Obtén el ID del usuario de la consulta
  try {
    const sesiones = await obtenerSesionesPlanificadasPorPersona(userId); // Llama a la función obtenerSesionesPlanificadasPorPersona con el ID recibido
    if (sesiones) {
      res.status(200).json({ sesiones }); // Devuelve las sesiones planificadas encontradas
    } else {
      res.status(404).json({ error: 'Sessions not found' }); // Devuelve un error si no se encuentran sesiones planificadas
    }
  } catch (error) {
    console.error('Error obtaining planned sessions:', error);
    res.status(500).json({ error: 'Internal server error' }); // Devuelve un error en caso de error interno del servidor
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})