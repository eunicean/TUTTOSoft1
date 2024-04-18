import express from 'express'
import cors from 'cors'
import {
  verificarUsuario,
  crearUsuario
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

app.get('/users/register', async (req, res) => {
  const { id, username, email } = req.query;
  try {
    await crearUsuario(id, username, email); 
    res.status(201).json({ message: 'User created successfully' }); 
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})