import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from './conn.js'; 
import dotenv from 'dotenv';

import { calificarSesion } from db.js

dotenv.config();

const secretKey = process.env.JWT_SECRET || 'tu_secreto_aqui'; 

const app = express();
app.use(cors({
    origin: ['http://localhost:5173'], // Adjust the CORS policy to accept requests from the frontend on port 5173
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);  // No token present

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);  // Token invalid or expired
        req.user = user;
        next();
    });
};

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Attempting login with email: ${email} and password: ${password}`);

    const domainRegex = /@uvg\.edu\.gt$/i;
    if (!domainRegex.test(email)) {
        return res.status(401).json({ success: false, message: "Invalid email domain. Only @uvg.edu.gt is allowed." });
    }

    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query('SELECT id, password FROM user WHERE email = ?', [email]);

            if (results.length > 0) {
                const user = results[0];
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
                    res.json({ success: true, message: "Login successful", token });
                } else {
                    res.status(401).json({ success: false, message: "Invalid credentials" });
                }
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    console.log(`Attempting to register a new user with username: ${username}, email: ${email}, role: ${role}`);

    const domainRegex = /@uvg\.edu\.gt$/i;
    if (!domainRegex.test(email)) {
        return res.status(401).json({ success: false, message: "Invalid email domain. Only @uvg.edu.gt is allowed." });
    }

    const typeuser = role === 'student' ? 1 : 2;

    try {
        const connection = await pool.getConnection();
        try {
            const [existingUser] = await connection.query('SELECT id FROM user WHERE email = ?', [email]);
            if (existingUser.length > 0) {
                return res.status(409).json({ success: false, message: "User already exists" });
            }

            const [maxResult] = await connection.query('SELECT MAX(id) AS maxId FROM user');
            const nextId = (maxResult[0].maxId || 0) + 1;

            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await connection.query(
                'INSERT INTO user (id, username, email, password, typeuser) VALUES (?, ?, ?, ?, ?)',
                [nextId, username, email, hashedPassword, typeuser]
            );

            console.log('User registered successfully:', result.insertId);
            res.json({ success: true, message: "User registered successfully", userId: result.insertId });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        let query = 'SELECT * FROM user WHERE id = ?';  // Asegúrate de seleccionar todos los campos necesarios
        let params = [userId];

        const [results] = await pool.query(query, params);
        // console.log('Datos del usuario:', results);  // Esto te mostrará los datos recuperados de la base de datos
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


app.post('/profile/update', authenticateToken, async (req, res) => {
    const { username, email } = req.body;
    try {
        // Asumiendo que `db` es tu conexión a la base de datos y tiene un método para actualizar
        await pool.query('UPDATE user SET username = ?, email = ? WHERE id = ?', [username, email, req.user.id]);
        res.json({ success: true, message: 'Perfil actualizado correctamente.' });
    } catch (error) {
        console.error('Error en la base de datos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});


// Endpoint to create a new session
app.post('/sessions/create', authenticateToken, async (req, res) => {
    const { date, time, subject } = req.body;
    const userId = req.user.id;  // Assuming you have access to the user's ID through the token

    try {
        const query = `INSERT INTO sessionPlanned (date, start_hour, course_code, id_student) VALUES (?, ?, ?, ?)`;
        const params = [date, time, subject, userId];

        // assuming you have a connection pool named pool
        const [result] = await pool.query(query, params);
        res.json({ success: true, message: "Session created successfully", session: { id: result.insertId, date, time, subject } });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message});
        
    }
});


// Period-based sessions endpoint
app.get('/sessions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const periodo = req.query.periodo;
        let query, params;

        console.log("Selected period is: " + periodo);

        if (periodo) {
            const { tiempoInicio, tiempoFin } = getPeriodoTimes(periodo);
            query = `
                SELECT sp.* 
                FROM students_Session ss
                JOIN sessionPlanned sp ON ss.id_session = sp.id
                WHERE ss.id_student = ? AND (
                    (sp.start_hour BETWEEN ? AND ?) OR
                    (sp.end_hour BETWEEN ? AND ?)
                )`;
            params = [userId, tiempoInicio, tiempoFin, tiempoInicio, tiempoFin];
        } else {
            query = `
                SELECT sp.* 
                FROM students_Session ss
                JOIN sessionPlanned sp ON ss.id_session = sp.id
                WHERE ss.id_student = ?`;
            params = [userId];
        }

        const [results] = await pool.query(query, params);
        console.log(results);
        if (results.length > 0) {
            res.json({ success: true, sessions: results });
        } else {
            res.json({ success: true, message: "No sessions found", sessions: [] });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Utility function for period times
function getPeriodoTimes(periodo) {
    let tiempoInicio, tiempoFin;
    switch (periodo) {
        case 'manana':
            tiempoInicio = '06:00:00';
            tiempoFin = '11:59:59';
            break;
        case 'tarde':
            tiempoInicio = '12:00:00';
            tiempoFin = '17:59:59';
            break;
        case 'noche':
            tiempoInicio = '18:00:00';
            tiempoFin = '23:59:59';
            break;
        default:
            throw new Error('Invalid period. Must be "manana", "tarde", or "noche".');
    }
    return { tiempoInicio, tiempoFin };
};


//Endpoint of an specific session, instead of a general view
app.get('/session-info', authenticateToken, async (req, res) => {
    const userId = req.user.id; // ID of the current user 
    const typeuser = req.user.role; // Tipo de usuario, asumiendo que esto es parte del token

    try {
        let query = `
            SELECT sp.*, u.name as tutorName, u2.name as studentName
            FROM sessionPlanned sp
            JOIN users u ON sp.tutor_id = u.id
            JOIN users u2 ON sp.student_id = u2.id
            WHERE sp.id IN (
                SELECT ss.id_session
                FROM students_Session ss
                WHERE ss.id_student = ?
            )`;

        const params = [userId];

        const [results] = await pool.query(query, params);
        if (results.length > 0) {
            const sessions = results.map(session => {
                return {
                    time: session.start_hour + ' - ' + session.end_hour,
                    subject: session.subject,
                    otherPartyName: userType === 'tutor' ? session.studentName : session.tutorName
                };
            });
            res.json({ success: true, sessions });
        } else {
            res.json({ success: true, message: "No sessions found", sessions: [] });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.post('/grade-session', authenticateToken, async (req, res) => {
    const { calificacion, comentario, id_receiver, id_session } = req.body;
    const id_sender = req.user.id;

    try {
        await calificarSesion(calificacion, comentario, id_sender, id_receiver, id_session);
        res.json({ success: true, message: "Sesión calificada exitosamente" });
    } catch (error) {
        console.error('Error al calificar la sesión:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
  
    console.log(`Server running on http://localhost:${PORT}`);
});
