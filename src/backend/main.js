import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from './conn.js'; 
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET || 'tu_secreto_aqui'; 
let currentMaxSessionId;

const app = express();
app.use(cors({
    origin: ['http://localhost:5173'], // Adjust the CORS policy to accept requests from the frontend on port 5173
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//Function to solve the autoincrement issue of the sessionPlanned table
const getMaxSessionId = async () => {
    const query = 'SELECT MAX(id) as maxId FROM sessionPlanned';
    const [rows] = await pool.query(query);
    return rows[0].maxId || 0; // Devolver 0 si la tabla está vacía
};


const initializeMaxSessionId = async () => {
    currentMaxSessionId = await getMaxSessionId();
    console.log(`Current max session ID is: ${currentMaxSessionId}`);
};

// Llamar a esta función al iniciar el servidor
initializeMaxSessionId();


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

//Endpoint to show the username of the searched email
app.get('/get-username-by-email', async (req, res) => {
    const { email } = req.query;

    try {
        const query = 'SELECT username FROM user WHERE email = ?';
        const [results] = await pool.query(query, [email]);

        if (results.length > 0) {
            res.json({ username: results[0].username });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


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

                if (user) {
                    const token = jwt.sign(
                        { id: user.id, role: user.role },  // Incluye el rol en el token
                        secretKey,
                        { expiresIn: '1h' }
                    );
                    
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
    const { date, startHour, endHour, subject, mode } = req.body;  // Incluye 'mode' en el cuerpo de la solicitud
    const userId = req.user.id;  // Asumiendo que tienes acceso al ID del usuario a través del token

    try {
        currentMaxSessionId += 1; // Incrementar el ID

        const query = `INSERT INTO sessionPlanned (id, date, start_hour, end_hour, course_code, id_tutor, mode) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [currentMaxSessionId, date, startHour, endHour, subject, userId, mode]; // Incluye 'mode' en los parámetros

        // Asumiendo que tienes una conexión al pool de base de datos llamada pool
        await pool.query(query, params);
        res.json({ success: true, message: "Session created successfully", session: { id: currentMaxSessionId, date, startHour, endHour, subject, mode } });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});



// Period-based sessions endpoint
app.get('/sessions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.typeuser; // Asumiendo que el tipo de usuario se almacena en el token
        const periodo = req.query.periodo;
        let query, params;

        console.log("Selected period is: " + periodo);

        if (periodo) {
            const { tiempoInicio, tiempoFin } = getPeriodoTimes(periodo);
            if (userType === '1') { // Si el usuario es un estudiante
                query = `
                    SELECT sp.* 
                    FROM students_Session ss
                    JOIN sessionPlanned sp ON ss.id_session = sp.id
                    WHERE ss.id_student = ? AND (
                        (sp.start_hour BETWEEN ? AND ?) OR
                        (sp.end_hour BETWEEN ? AND ?)
                    )`;
                params = [userId, tiempoInicio, tiempoFin, tiempoInicio, tiempoFin];
            } else { // Si el usuario es un tutor
                query = `
                    SELECT sp.* 
                    FROM sessionPlanned sp
                    WHERE sp.id_tutor = ? AND (
                        (sp.start_hour BETWEEN ? AND ?) OR
                        (sp.end_hour BETWEEN ? AND ?)
                    )`;
                params = [userId, tiempoInicio, tiempoFin, tiempoInicio, tiempoFin];
            }
        } else {
            if (userType === '1') { // Si el usuario es un estudiante
                query = `
                    SELECT sp.* 
                    FROM students_Session ss
                    JOIN sessionPlanned sp ON ss.id_session = sp.id
                    WHERE ss.id_student = ?`;
                params = [userId];
            } else { // Si el usuario es un tutor
                query = `
                    SELECT sp.* 
                    FROM sessionPlanned sp
                    WHERE sp.id_tutor = ?`;
                params = [userId];
            }
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


// Endpoint for fetching detailed session information
app.get('/session-info/:sessionId', authenticateToken, async (req, res) => {
    const sessionId = req.params.sessionId;

    try {
        let query = `
            SELECT 
                sp.id,
                sp.date,
                sp.start_hour,
                sp.end_hour,
                sp.course_code,
                tutor.username as tutorName,
                student.username as studentName
            FROM 
                sessionPlanned sp
            JOIN 
                user tutor ON sp.id_tutor = tutor.id
            JOIN 
                students_Session ss ON sp.id = ss.id_session
            JOIN 
                user student ON ss.id_student = student.id
            WHERE 
                sp.id = ?;
        `;

        const [results] = await pool.query(query, [sessionId]);

        if (results.length > 0) {
            const session = results.map(row => ({
                id: row.id,
                date: row.date, 
                startHour: row.start_hour,
                endHour: row.end_hour,
                subject: row.course_code,
                tutorName: row.tutorName,
                studentName: row.studentName
            }))[0];

            res.json({ success: true, session });
        } else {
            res.json({ success: false, message: "Session not found" });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//Endpoint that to cancel planned sesions, it will insert the info into cancelled sessions table, and will remove it from the sessionPlanned table. 
app.post('/cancel-session', authenticateToken, async (req, res) => {
    const { sessionId, reason } = req.body;
    const userId = req.user.id; // Obtener el ID del usuario desde el token de autenticación

    if (!sessionId || !reason) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }

    const connection = await pool.getConnection(); // Obtener una conexión de la piscina
    try {
        await connection.beginTransaction(); // Iniciar la transacción

        // Insertar el motivo de cancelación en cancellationReasons
        const cancelQuery = 'INSERT INTO cancellationReasons (session_id, user_id, reason) VALUES (?, ?, ?)';
        await connection.query(cancelQuery, [sessionId, userId, reason]);

        // Eliminar la sesión de sessionPlanned
        const deleteQuery = 'DELETE FROM sessionPlanned WHERE id = ?';
        await connection.query(deleteQuery, [sessionId]);

        await connection.commit(); // Confirmar la transacción

        res.json({ success: true, message: "Sesión cancelada y motivo guardado exitosamente" });
    } catch (error) {
        await connection.rollback(); // Revertir la transacción en caso de error
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    } finally {
        connection.release(); // Liberar la conexión
    }
});

const PORT = 5000;
app.listen(PORT, () => {
  
    console.log(`Server running on http://localhost:${PORT}`);
});
