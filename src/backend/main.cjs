const { 
    verificarUsuario, 
    crearUsuario, 
    obtenerTipoUsuarioPorId, 
    obtenerSesionesPlanificadasPorPersona 
  } = require('./db.cjs');
  
  const express = require('express');
  const cors = require('cors');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');
  const pool = require('./conn.cjs');

console.log("main si se ejecuta");

// dotenv.config();
const app = express();

const secretKey = process.env.JWT_SECRET || 'tu_secreto_aqui'; 
let currentMaxSessionId;

//module.exports = app;
app.use(cors({
    origin: ['http://localhost:5173', 'https://209.126.125.63'], 
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
app.get('/api/get-username-by-email', async (req, res) => {
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
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const domainRegex = /@uvg\.edu\.gt$/i;
    if (!domainRegex.test(email)) {
        return res.status(401).json({ success: false, message: "Invalid email domain. Only @uvg.edu.gt is allowed." });
    }

    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(
                `SELECT u.id, u.password, u.typeuser
                 FROM user u 
                 WHERE u.email = ?`, 
                [email]
            );

            if (results.length > 0) {
                const user = results[0];
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    const token = jwt.sign(
                        { id: user.id, typeuser: user.typeuser},  
                        secretKey,
                        { expiresIn: '1h' }
                    );
                    
                    res.json({ success: true, message: "Login successful", token });
                    console.log(results);

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

// Endpoint para obtener el tipo de usuario por ID
app.get('/api/users/type', async (req, res) => {
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
app.get('/api/users/sessions', async (req, res) => {
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


// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password, role} = req.body; // Asegúrate de incluir el año en el request body.

    const domainRegex = /@uvg\.edu\.gt$/i;
    if (!domainRegex.test(email)) {
        return res.status(401).json({ success: false, message: "Invalid email domain. Only @uvg.edu.gt is allowed." });
    }

    const typeuser = 1; // Asumiendo que todos son registrados como estudiantes (typeuser = 1)

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

            res.json({ success: true, message: "User registered successfully", userId: result.insertId });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});



app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.typeuser;

        let query = 'SELECT * FROM user WHERE id = ?';
        let params = [userId];

        const [userResults] = await pool.query(query, params);

        if (userResults.length > 0) {
            const user = userResults[0];

            // Si el usuario es un tutor (typeuser == 2), obtener sus especialidades
            if (userType == 2) {  // Usamos == en lugar de === en caso de que userType sea un string
                const specialtyQuery = `
                    SELECT st.course_code, c.namecourse AS course_name
                    FROM specialtyTutor st
                    INNER JOIN course c ON st.course_code = c.course_code
                    WHERE st.id_tutor = ?
                `;

                const [specialtyResults] = await pool.query(specialtyQuery, [userId]);
                

                // Agregar las especialidades al objeto del usuario
                user.specialties = specialtyResults;
            }
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});



app.post('/api/profile/update', authenticateToken, async (req, res) => {
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
app.post('/api/sessions/create', authenticateToken, async (req, res) => {
    const { date, startHour, endHour, subject, mode, studentEmail } = req.body;
    const tutorId = req.user.id;

    try {
        const studentQuery = 'SELECT id FROM user WHERE email = ?';
        const [studentResult] = await pool.query(studentQuery, [studentEmail]);

        if (studentResult.length === 0) {
            return res.status(400).json({ success: false, message: 'Student not found' });
        }

        const studentId = studentResult[0].id;

        // Obtener el máximo id actual de la tabla
        const maxIdQuery = 'SELECT MAX(id) AS maxId FROM sessionPlanned';
        const [maxIdResult] = await pool.query(maxIdQuery);
        const currentMaxSessionId = maxIdResult[0].maxId + 1;

        const sessionQuery = 'INSERT INTO sessionPlanned (id, date, start_hour, end_hour, course_code, id_tutor, mode) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const sessionParams = [currentMaxSessionId, date, startHour, endHour, subject, tutorId, mode];

        await pool.query(sessionQuery, sessionParams);

        const studentsSessionQuery = 'INSERT INTO students_Session (id_session, id_student) VALUES (?, ?)';
        const studentsSessionParams = [currentMaxSessionId, studentId];

        await pool.query(studentsSessionQuery, studentsSessionParams);

        res.json({ success: true, message: 'Session created successfully', session: { id: currentMaxSessionId, date, startHour, endHour, subject, mode, studentId } });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



// Period-based sessions endpoint
app.get('/api/sessions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.typeuser; // Suponiendo que este valor está disponible para determinar si es estudiante o tutor
        const periodo = req.query.periodo;
        let query, params;
        // console.log("Selected period is: " + periodo);

        if (periodo) {
            const { tiempoInicio, tiempoFin } = getPeriodoTimes(periodo);
            query = `
                SELECT sp.*, c.namecourse
                FROM sessionPlanned sp
                LEFT JOIN students_Session ss ON sp.id = ss.id_session AND ss.id_student = ?
                LEFT JOIN course c ON sp.course_code = c.course_code
                WHERE (ss.id_session IS NOT NULL OR sp.id_tutor = ?) AND (
                    (sp.start_hour BETWEEN ? AND ?) OR
                    (sp.end_hour BETWEEN ? AND ?)
                )`;
            params = [userId, userId, tiempoInicio, tiempoFin, tiempoInicio, tiempoFin];
        } else {
            query = `
                SELECT sp.*, c.namecourse
                FROM sessionPlanned sp
                LEFT JOIN students_Session ss ON sp.id = ss.id_session AND ss.id_student = ?
                LEFT JOIN course c ON sp.course_code = c.course_code
                WHERE ss.id_session IS NOT NULL OR sp.id_tutor = ?`;
            params = [userId, userId];
        }
        
        const [results] = await pool.query(query, params);
        // console.log(results);
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
app.get('/api/sessions/:sessionId', authenticateToken, async (req, res) => {
    const sessionId = req.params.sessionId;
    try {
        const sessionQuery = `
            SELECT 
                sp.id, sp.date, sp.start_hour, sp.end_hour, sp.course_code, c.namecourse, sp.mode, 
                sp.tutorNotes, 
                tutor.username as tutorName, student.username as studentName
            FROM 
                sessionPlanned sp
            
            LEFT JOIN course c ON sp.course_code = c.course_code
            
            JOIN 
                user tutor ON sp.id_tutor = tutor.id
            JOIN 
                students_Session ss ON sp.id = ss.id_session
            JOIN 
                user student ON ss.id_student = student.id
            WHERE 
                sp.id = ?;
        `;

        // Ejecutar la consulta de la sesión
        const [sessionResults] = await pool.query(sessionQuery, [sessionId]);
        if (sessionResults.length > 0) {
            const session = {
                id: sessionResults[0].id,
                date: sessionResults[0].date,
                startHour: sessionResults[0].start_hour,
                endHour: sessionResults[0].end_hour,
                courseCode: sessionResults[0].course_code,
                namecourse: sessionResults[0].namecourse,
                mode: sessionResults[0].mode,
                tutorNotes: sessionResults[0].tutorNotes, 
                tutorName: sessionResults[0].tutorName,
                studentName: sessionResults[0].studentName
            };
            
            // console.log(sessionResults);
            res.json({ success: true, session });
        } else {
            res.status(404).json({ success: false, message: "Session not found" });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.post('/api/grade-session/:sessionID', authenticateToken, async (req, res) => {
    const { calificacion, comentario } = req.body;
    const id_sender = req.user.id; // ID del usuario autenticado desde el token
    const sessionID = req.params.sessionID;

    try {
        const conexion = await pool.getConnection();
        try {
            // Verificar si el usuario es tutor en esta sesión
            console.log(id_sender);
            const [tutorResult] = await conexion.query(
                `SELECT id_tutor FROM sessionPlanned WHERE id = ? AND id_tutor = ?`,
                [sessionID, id_sender]
            );

            let id_receiver;

            if (tutorResult.length > 0) {
                // Si es tutor, obtenemos el ID del estudiante desde `students_Session`
                const [studentResult] = await conexion.query(
                    `SELECT id_student FROM students_Session WHERE id_session = ?`,
                    [sessionID]
                );

                if (studentResult.length === 0) {
                    return res.status(404).json({ success: false, message: 'Estudiante no encontrado en esta sesión' });
                }
                id_receiver = studentResult[0].id_student;
            } else {
                // Si no es tutor, buscamos al tutor de la sesión
                const [tutorInSession] = await conexion.query(
                    `SELECT id_tutor FROM sessionPlanned WHERE id = ?`,
                    [sessionID]
                );

                if (tutorInSession.length === 0) {
                    return res.status(404).json({ success: false, message: 'Tutor no encontrado en esta sesión' });
                }
                id_receiver = tutorInSession[0].id_tutor;
            }

            // Insertar la calificación en la tabla `comment`
            const [comentarios] = await conexion.query(
                `INSERT INTO comment (rating, commentContent, id_sender, id_receiver, id_session) 
                 VALUES (?, ?, ?, ?, ?)`,
                [calificacion, comentario, id_sender, id_receiver, sessionID]
            );

            console.log('Comentario insertado:', comentarios);
            res.json({ success: true, message: 'Sesión calificada exitosamente' });
        } finally {
            conexion.release();
        }
    } catch (error) {
        console.error('Error al calificar la sesión:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


app.post('/api/report-absence/:sessionID', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const id_sender = req.user.id; // Usuario autenticado
    const sessionID = req.params.sessionID;
    const absentDate = new Date().toISOString().split('T')[0]; // Fecha actual en formato 'YYYY-MM-DD'

    try {
        const conexion = await pool.getConnection();
        try {
            console.log(`Remitente -> ${id_sender}`);
            // Verificar si el usuario es tutor en esta sesión
            const [tutorResult] = await conexion.query(
                `SELECT id_tutor FROM sessionPlanned WHERE id = ? AND id_tutor = ?`,
                [sessionID, id_sender]
            );

            let id_absentParticipant;

            if (tutorResult.length > 0) {
                // Si es tutor, el ausente es el estudiante
                const [studentResult] = await conexion.query(
                    `SELECT id_student FROM students_Session WHERE id_session = ?`,
                    [sessionID]
                );

                if (studentResult.length === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Estudiante no encontrado en esta sesión' 
                    });
                }
                id_absentParticipant = studentResult[0].id_student;
            } else {
                // Si no es tutor, el ausente es el tutor
                const [tutorInSession] = await conexion.query(
                    `SELECT id_tutor FROM sessionPlanned WHERE id = ?`,
                    [sessionID]
                );

                if (tutorInSession.length === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Tutor no encontrado en esta sesión' 
                    });
                }
                id_absentParticipant = tutorInSession[0].id_tutor;
            }
            // Insertar el reporte de ausencia en la base de datos
            const [result] = await conexion.query(
                `INSERT INTO reportAbsence (id_sender, id_absentParticipant, message, idSession, absentDate)
                 VALUES (?, ?, ?, ?, ?)`,
                [id_sender, id_absentParticipant, message, sessionID, absentDate]
            );

            console.log('Reporte de ausencia insertado:', result);
            res.json({
                success: true,
                message: 'Reporte de ausencia registrado exitosamente',
                reportId: result.insertId
            });

        } finally {
            conexion.release();
        }
    } catch (error) {
        console.error('Error al registrar el reporte de ausencia:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});


//Endpoint that to cancel planned sesions, it will insert the info into cancelled sessions table, and will remove it from the sessionPlanned table. 
app.post('/api/cancel-session/:sessionID', authenticateToken, async (req, res) => {
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

        // Eliminar dependencias en students_Session antes de eliminar la sesión
        const deleteStudentsSessionQuery = 'DELETE FROM students_Session WHERE id_session = ?';
        await connection.query(deleteStudentsSessionQuery, [sessionId]);

        // Eliminar dependencias en report antes de eliminar la sesión
        const deleteReportQuery = 'DELETE FROM report WHERE id_session = ?';
        await connection.query(deleteReportQuery, [sessionId]);

        // Eliminar dependencias en cancellationReasons antes de eliminar la sesión
        const deleteCancellationReasonsQuery = 'DELETE FROM cancellationReasons WHERE session_id = ?';
        await connection.query(deleteCancellationReasonsQuery, [sessionId]);

        // Finalmente, eliminar la sesión de sessionPlanned
        const deleteSessionPlannedQuery = 'DELETE FROM sessionPlanned WHERE id = ?';
        await connection.query(deleteSessionPlannedQuery, [sessionId]);

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


// app.get('/api/average-rating', authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user.id;
//         let query = `
//             SELECT AVG(rating) as averageRating 
//             FROM userRatings 
//             WHERE user_id = ?`; 
//         let params = [userId];

//         const [results] = await pool.query(query, params);

//         if (results.length > 0 && results[0].averageRating !== null) {
//             res.json({ success: true, averageRating: results[0].averageRating });
//         } else {
//             res.status(404).json({ success: false, message: "No ratings found for user" });
//         }
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// });


//Endpoint para listar todas las sesiones pasadas de un usuario
app.get('/api/session-history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.typeuser;
        const currentDate = new Date().toISOString().slice(0, 10);  // Fecha actual en formato YYYY-MM-DD

        let query, params;

        if (userType === '1') { // Assuming 1 = Student
            query = `
                SELECT sp.*, u.username as tutorName, cr.created_at as cancellationDate
                FROM sessionPlanned sp
                JOIN students_Session ss ON sp.id = ss.id_session
                JOIN user u ON sp.id_tutor = u.id
                LEFT JOIN cancellationReasons cr ON sp.id = cr.session_id
                WHERE ss.id_student = ? AND (sp.date < ? OR cr.created_at IS NOT NULL)
                ORDER BY sp.date DESC, sp.start_hour DESC`;
            params = [userId, currentDate];
        } else if (userType === '2') { // Assuming 2 = Tutor
            query = `
                SELECT sp.*, GROUP_CONCAT(u.username SEPARATOR ', ') as studentNames, cr.created_at as cancellationDate
                FROM sessionPlanned sp
                LEFT JOIN students_Session ss ON sp.id = ss.id_session
                LEFT JOIN user u ON ss.id_student = u.id
                LEFT JOIN cancellationReasons cr ON sp.id = cr.session_id
                WHERE sp.id_tutor = ? AND (sp.date < ? OR cr.created_at IS NOT NULL)
                GROUP BY sp.id
                ORDER BY sp.date DESC, sp.start_hour DESC`;
            params = [userId, currentDate];
        } else {
            return res.status(400).json({ success: false, message: "Invalid user type" });
        }

        const [results] = await pool.query(query, params);

        if (results.length > 0) {
            res.json({ success: true, sessions: results });
        } else {
            res.json({ success: true, message: "No session history found", sessions: [] });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


// Endpoint to get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const query = 'SELECT course_code, namecourse FROM course';
        const [results] = await pool.query(query);
        // console.log(results);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ message: 'No courses found' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Endpoint to get all tutors with their courses and average rating
app.get('/api/tutors', async (req, res) => {
    try {
        const query = `
            SELECT x.id, x.username, x.email, x.typeuser, 
                   GROUP_CONCAT(c.namecourse ORDER BY c.namecourse SEPARATOR ', ') AS courses,
                   COALESCE(avg_rating.avg_rating, 0) AS avg_rating
            FROM user x
            JOIN specialtyTutor st ON x.id = st.id_tutor
            JOIN course c ON c.course_code = st.course_code
            LEFT JOIN (
                SELECT id_receiver, AVG(rating) AS avg_rating
                FROM comment
                GROUP BY id_receiver
            ) avg_rating ON x.id = avg_rating.id_receiver
            WHERE x.typeuser = 2
            GROUP BY x.id, x.username, x.email, x.typeuser, avg_rating.avg_rating;
        `;
        
        const [results] = await pool.query(query);
        
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ message: 'No se encontró tutores' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint para obtener la lista de estudiantes
app.get('/api/students', async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.username, u.email, 
                   COALESCE(avg_rating.avg_rating, 0) AS avg_rating
            FROM user u
            LEFT JOIN (
                SELECT id_receiver, AVG(rating) AS avg_rating
                FROM comment
                GROUP BY id_receiver
            ) avg_rating ON u.id = avg_rating.id_receiver
            WHERE u.typeuser = 1  -- Estudiantes tienen el tipo de usuario 1
            GROUP BY u.id, u.username, u.email, avg_rating.avg_rating;
        `;

        const [results] = await pool.query(query);

        if (results.length > 0) {
            res.json(results); // Devuelve los estudiantes encontrados
        } else {
            res.status(404).json({ message: 'No se encontraron estudiantes' });
        }
    } catch (error) {
        console.error('Error en la base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

app.get('/api/chats/:chatId', authenticateToken, async (req, res) => {
    const chatId = req.params.chatId;

    try {
        const chatAndMessagesQuery = `
  SELECT 
    m.id AS messageId,
    m.message AS content,
    m.time_stamp AS timeSent,
    u.username AS senderUsername,
    u.id AS senderId  -- Asegúrate de incluir el ID correcto del remitente
  FROM 
    chats_nueva cn
  JOIN 
    messages_nueva m ON cn.id = m.id_chat
  JOIN 
    user u ON m.id_sender = u.id  -- Relacionar el remitente con el usuario
  WHERE 
    cn.id = ?
  ORDER BY 
    m.time_stamp ASC;
`;

const [results] = await pool.query(chatAndMessagesQuery, [chatId]);


        if (results.length > 0) {
            const formattedMessages = results.map(result => ({
                messageId: result.messageId,
                chatId: result.chatId,
                senderId: result.id_sender,
                senderUsername: result.senderUsername,
                content: result.content,
                timeSent: result.timeSent
            }));

            // Aquí agregamos un console.log para ver los mensajes formateados que se enviarán al cliente
            console.log('Mensajes formateados que se enviarán:', formattedMessages);

            res.json({ success: true, chatId: chatId, messages: formattedMessages });
        } else {
            res.status(404).json({ success: false, message: "Chat not found or no messages in the chat" });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});



app.get('/api/chats', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extraer el ID del usuario autenticado
  
    try {
        // Aquí es donde debes asegurar que se devuelva el 'otherUserId' y 'otherUsername' correctamente
        const chatsQuery = `
        SELECT 
            cn.id AS chatId,
            CASE 
                WHEN cn.id_sender = ? THEN cn.id_recipient
                ELSE cn.id_sender
            END AS otherUserId,
            CASE 
                WHEN cn.id_sender = ? THEN u2.username
                ELSE u1.username
            END AS otherUsername,
            m.message AS lastMessage,
            m.max_time_stamp AS lastMessageTime
        FROM 
            chats_nueva cn
        LEFT JOIN 
            user u1 ON cn.id_sender = u1.id
        LEFT JOIN 
            user u2 ON cn.id_recipient = u2.id
        LEFT JOIN 
            (
                SELECT 
                    id_chat,
                    MAX(time_stamp) AS max_time_stamp,
                    SUBSTRING_INDEX(GROUP_CONCAT(message ORDER BY time_stamp DESC), ',', 1) AS message
                FROM 
                    messages_nueva
                GROUP BY 
                    id_chat
            ) m ON cn.id = m.id_chat
        WHERE 
            cn.id_sender = ? OR cn.id_recipient = ?
        ORDER BY 
            m.max_time_stamp DESC;
      `;

      const [chats] = await pool.query(chatsQuery, [userId, userId, userId, userId]);
  
      if (chats.length > 0) {
        const chatList = chats.map(chat => ({
          chatId: chat.chatId,
          otherUserId: chat.otherUserId,
          otherUsername: chat.otherUsername,
          lastMessage: chat.lastMessage,
          lastMessageTime: chat.lastMessageTime
        }));

        res.json({ success: true, chats: chatList });
        console.log(chatList);
      } else {
        res.json({ success: true, message: "No chats found", chats: [] });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});


  

app.post('/api/send-message', authenticateToken, async (req, res) => {
    const { id_recipient, message } = req.body;
    const id_sender = req.user.id; // Asumimos que el usuario autenticado es el remitente

    try {
        // Verificar si ya existe un chat entre los dos usuarios
        const existingChatQuery = `
            SELECT id FROM chats_nueva
            WHERE (id_sender = ? AND id_recipient = ?) OR (id_sender = ? AND id_recipient = ?);
        `;
        const [existingChat] = await pool.query(existingChatQuery, [id_sender, id_recipient, id_recipient, id_sender]);

        let chatId;
        if (existingChat.length > 0) {
            chatId = existingChat[0].id;
        } else {
            // Crear un nuevo chat si no existe
            const insertChatQuery = `
                INSERT INTO chats_nueva (id_sender, id_recipient)
                VALUES (?, ?);
            `;
            const [newChat] = await pool.query(insertChatQuery, [id_sender, id_recipient]);
            chatId = newChat.insertId;
        }

        // Insertar el mensaje en messages_nueva
        const insertMessageQuery = `
            INSERT INTO messages_nueva (id_chat, id_sender, message)
            VALUES (?, ?, ?);
        `;
        await pool.query(insertMessageQuery, [chatId, id_sender, message]);

        res.json({ success: true, message: "Mensaje enviado con éxito", chatId: chatId });
        console.log("ID SENDER", id_sender,"CHAT ID",chatId, "MESSAGE", message)
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;