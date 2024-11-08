const conn = require('./conn.cjs');

// Función para buscar un usuario por email
async function buscarUsuarioPorEmail(email) {
    const conexion = await conn;
    try {
        const [usuarios] = await conexion.execute(`SELECT * FROM user WHERE email = ?`, [email]);

    } catch (error) {
        console.error('Error al buscar usuario:', error);
    }
}

// Función para verificar usuario con contraseña
async function verificarUsuario(email, contrasenia) {
    const conexion = await conn;
    try {
        const [usuarios] = await conexion.execute(`SELECT * FROM user WHERE email = ? AND password = ?`, [email, contrasenia]);
        return usuarios.length > 0;
    } catch (error) {
        console.error('Datos incorrectos del usuario:', error);
    }
}

// Función para crear un nuevo usuario
async function crearUsuario(id, username, email, password) {
    const conexion = await conn;
    try {
        const [result] = await conexion.execute(`INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`, [id, username, email, password]);
        return result.affectedRows === 1;
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }
}

// Función para eliminar un usuario por ID
async function eliminarUsuarioPorID(id) {
    const conexion = await conn;
    try {
        const [result] = await conexion.execute(`DELETE FROM user WHERE id = ?`, [id]);
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}

// Función para borrar chats con un usuario
async function borrarChatsConUsuario(idChat) {
    const conexion = await conn;
    try {
        const [usuarios] = await conexion.execute(`DELETE FROM chat_integrants WHERE id_chat = ?`, [idChat]);
    } catch (error) {
        console.error('Error al borrar chats:', error);
    }
}

// Función para ver sesiones en curso
async function verSesionesEnCurso() {
    const conexion = await conn;
    try {
        const [sesion] = await conexion.execute(`SELECT * FROM sessionPlanned WHERE date = CURDATE() AND start_hour <= CURTIME() AND end_hour >= CURTIME()`);
    } catch (error) {
        console.error('Error al ver sesiones en curso:', error);
    }
}

// Función para borrar una sesión
async function borrarSesion(date) {
    const conexion = await conn;
    try {
        const [sesion] = await conexion.execute(`DELETE FROM sessionPlanned WHERE date = ?`, [date]);
    } catch (error) {
        console.error('Error al borrar sesión:', error);
    }
}

// Función para obtener todos los estudiantes
async function obtenerEstudiantes() {
    const conexion = await conn;
    try {
        const [estudiantes] = await conexion.execute(`SELECT u.id, u.username, u.email FROM user u JOIN student s ON u.id = s.id`);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
    }
}

// Función para obtener mensajes de un chat específico
async function obtenerMensajesDeChat(idChat) {
    const conexion = await conn;
    try {
        const [mensajes] = await conexion.execute(`SELECT m.content, m.time_sent FROM messages m JOIN chat_messages cm ON m.id_message = cm.id_message WHERE cm.id_chat = ?`, [idChat]);
    } catch (error) {
        console.error('Error al obtener mensajes de chat:', error);
    }
}

// Función para obtener sesiones planificadas y su información de curso correspondiente
async function obtenerSesionesPlanificadas() {
    const conexion = await conn;
    try {
        const [sesiones] = await conexion.execute(`SELECT sp.id, c.namecourse, sp.date, sp.start_hour, sp.end_hour, sp.mode FROM sessionPlanned sp JOIN course c ON sp.course_code = c.course_code`);
    } catch (error) {
        console.error('Error al obtener sesiones planificadas:', error);
    }
}

// Función para obtener sesiones planificadas por persona
async function obtenerSesionesPlanificadasPorPersona(userId) {
    const conexion = await conn;
    try {
        const [sesiones] = await conexion.execute(`SELECT sp.id, c.namecourse, sp.date, sp.start_hour, sp.end_hour, sp.mode, ss.id_student FROM sessionPlanned sp JOIN course c ON sp.course_code = c.course_code JOIN students_Session ss ON sp.id = ss.id_session WHERE ss.id_student = ?`, [userId]);
        return sesiones;
    } catch (error) {
        console.error('Error al obtener sesiones planificadas:', error);
    }
}

// Función para obtener reportes de ausencia junto con la información del remitente y del ausente
async function obtenerReportesDeAusencia() {
    const conexion = await conn;
    try {
        const [reportes] = await conexion.execute(`SELECT ar.comment, ar.id_session, u1.username AS 'Sender', u2.username AS 'Absent Party' FROM ausentReport ar JOIN user u1 ON ar.id_sender = u1.id JOIN user u2 ON ar.id_ausentparty = u2.id`);
    } catch (error) {
        console.error('Error al obtener reportes de ausencia:', error);
    }
}

// Función para obtener la disponibilidad de estudiantes
async function obtenerDisponibilidadEstudiantes() {
    const conexion = await conn;
    try {
        const [disponibilidad] = await conexion.execute(`SELECT u.username, hd.hournumber, hd.day_week FROM hoursdisponibility hd JOIN user u ON hd.studentID = u.id`);
    } catch (error) {
        console.error('Error al obtener disponibilidad de estudiantes:', error);
    }
}

// Función para obtener horas disponibles por persona
async function obtenerHorasDisponiblesPersona(id) {
    const conexion = await conn;
    try {
        const [horas] = await conexion.execute(`SELECT * FROM hoursdisponibility WHERE studentID = ?`, [id]);
    } catch (error) {
        console.error('Error al obtener disponibilidad de estudiantes:', error);
    }
}

// Función para ingresar nuevas horas de disponibilidad
async function ingresarNuevasHoras(hora, day, studentID) {
    const conexion = await conn;
    try {
        const [horas] = await conexion.execute(`INSERT INTO hoursdisponibility(hournumber, day_week, studentID) VALUES(?, ?, ?)`, [hora, day, studentID]);
    } catch (error) {
        console.error('Error al ingresar nuevas horas de disponibilidad:', error);
    }
}

// Función para eliminar horas de disponibilidad
async function eliminarHoras(hora, day, studentID) {
    const conexion = await conn;
    try {
        const [horas] = await conexion.execute(`DELETE FROM hoursdisponibility WHERE studentID = ? AND hournumber = ? AND day_week = ?`, [studentID, hora, day]);
        
    } catch (error) {
        console.error('Error al eliminar horas de disponibilidad:', error);
    }
}

// Función para obtener el tipo de usuario por ID
async function obtenerTipoUsuarioPorId(userId){
    const conexion = await conn;
    try {
        const [resultado] = await conexion.execute(`SELECT typeuser FROM user WHERE id=?`, [userId]);
        return resultado;
    } catch (error) {
        console.error('Error al obtener el tipo de usuario:', error);
    }
}

// Función para calificar una sesión
async function calificarSesion(calificacion, comentario, id_sender, id_receiver, id_session) {
    const conexion = await conn;
    try {
        const [comentarios] = await conexion.execute(`INSERT INTO comment(rating, commentContent, id_sender, id_receiver, id_session) VALUES(?, ?, ?, ?, ?)`, [calificacion, comentario, id_sender, id_receiver, id_session]);
        
    } catch (error) {
        console.error('Error al intentar calificar sesión:', error);
    }
}

module.exports = {
    obtenerTipoUsuarioPorId,
    buscarUsuarioPorEmail, 
    verificarUsuario,
    crearUsuario, 
    eliminarHoras, 
    borrarChatsConUsuario, 
    verSesionesEnCurso, 
    borrarSesion, 
    obtenerEstudiantes, 
    obtenerMensajesDeChat, 
    obtenerSesionesPlanificadas, 
    obtenerSesionesPlanificadasPorPersona, 
    obtenerReportesDeAusencia,
    obtenerDisponibilidadEstudiantes,
    obtenerHorasDisponiblesPersona, 
    ingresarNuevasHoras, 
    calificarSesion
};
