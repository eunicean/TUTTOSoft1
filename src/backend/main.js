import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from './conn.js'; 
import dotenv from 'dotenv';

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
        const query = 'SELECT typeuser FROM user WHERE id = ?';
        const params = [userId];

        const [results] = await pool.query(query, params);
        console.log('Results:', results);  // Esto te ayudará a ver la estructura de results

        if (results.length > 0) {
            const typeuser = results[0].typeuser;  // Accediendo correctamente al campo typeuser
            res.json({ success: true, typeuser });  // Responder con el tipo de usuario
        } else {
            res.json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
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
        // if (results.length > 0) {
        //     res.json({ success: true, sessions: results });
        // } else {
        //     res.json({ success: true, message: "No sessions found", sessions: [] });
        // }
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


const PORT = 5000;
app.listen(PORT, () => {
  
    console.log(`Server running on http://localhost:${PORT}`);
});
