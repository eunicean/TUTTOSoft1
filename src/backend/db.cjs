const conn = require('./conn.cjs');
console.log("db.js se ejecuto");
// Función para buscar un usuario por email
async function buscarUsuarioPorEmail(email) {
    const conexion = await conn;
    try {
        const [usuarios] = await conexion.execute(`SELECT * FROM user WHERE email = '${email}'`);
        console.log(usuarios);
    } catch (error) {
        console.error('Error al buscar usuario:', error);
    }
}

async function verificarUsuario(email,constrasenia) {
    const conexion = await conn;
    try {
        const [usuarios] = await conexion.execute(`SELECT * FROM user WHERE email = '${email}' AND password = '${constrasenia}'`);
        let result;
        if (usuarios.length > 0) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.error('Datos incorrectos del usuario:', error);
    }
}

// Función para crear un nuevo usuario
async function crearUsuario(id, username, email, password) {
    const conexion = await conn;
    try {
        const [result] = await conexion.execute(`INSERT INTO user (id, username, email, password) VALUES (${id}, '${username}', '${email}', '${password}')`);
        return result.affectedRows === 1;
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }
}
// Función para eliminar un usuario por ID
 async function eliminarUsuarioPorID(id) {
    const conexion = await conn;
    try {
        const [result] = await conexion.execute(`Delete from user where ID = ${id}`);
        console.log(result);
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}

// Función para borrar chats con un usuario
 async function borrarChatsConUsuario(idChat) {
    const conexion = await conn;
    try {
        const [usuarios] = await conexion.execute(`DELETE FROM chat_integrants WHERE id_chat = ${idChat}`);
        console.log(usuarios);
    } catch (error) {
        console.error('Error al borrar chats:', error);
    }
}

// Función para ver sesiones en curso
 async function verSesionesEnCurso() {
    const conexion = await conn;
    try {
        const [sesion] = await conexion.execute(`SELECT * FROM sessionPlanned WHERE date = CURDATE() AND start_hour <= CURTIME() AND end_hour >= CURTIME()`);
        console.log(sesion);
    } catch (error) {
        console.error('Error al ver sesiones en curso:', error);
    }
} //changes to do: add the userId to the sessionTo list, change from curdate from date to list all the 

// Función para borrar una sesión
 async function borrarSesion(date) {
    const conexion = await conn;
    try {
        const [sesion] = await conexion.execute(`DELETE FROM sessionPlanned WHERE date = '${date}'`);
        console.log(sesion);
    } catch (error) {
        console.error('Error al borrar sesión:', error);
    }
}

// Todos los usuarios que son estudiantes
 async function obtenerEstudiantes() {
    const pool = await crearPoolConexion();
    try {
        const conexion = await pool.getConnection();
        const [estudiantes] = await conexion.execute(`
            SELECT u.id, u.username, u.email 
            FROM user u 
            JOIN student s ON u.id = s.id
        `);
        console.log(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
    }
}

// Todos los mensajes de un chat específico
 async function obtenerMensajesDeChat(idChat) {
    const pool = await crearPoolConexion();
    try {
        const conexion = await pool.getConnection();
        const [mensajes] = await conexion.execute(`
            SELECT m.content, m.time_sent 
            FROM messages m 
            JOIN chat_messages cm ON m.id_message = cm.id_message 
            WHERE cm.id_chat = ?
        `, [idChat]);
        console.log(mensajes);
    } catch (error) {
        console.error('Error al obtener mensajes de chat:', error);
    }
}

// Sesiones planificadas y su información de curso correspondiente
 async function obtenerSesionesPlanificadas() {
    const pool = await crearPoolConexion();
    try {
        const conexion = await pool.getConnection();
        const [sesiones] = await conexion.execute(`
            SELECT sp.id, c.namecourse, sp.date, sp.start_hour, sp.end_hour, sp.mode 
            FROM sessionPlanned sp 
            JOIN course c ON sp.course_code = c.course_code
        `);
        console.log(sesiones);
    } catch (error) {
        console.error('Error al obtener sesiones planificadas:', error);
    }
}

 async function obtenerSesionesPlanificadasPorPersona(userId) {
    const pool = await crearPoolConexion();
    try {
        const conexion = await pool.getConnection();
        const [sesiones] = await conexion.execute(`
            SELECT sp.id, c.namecourse, sp.dated, sp.start_hour, sp.end_hour, sp.mode, ss.id_student
            FROM sessionPlanned sp 
            JOIN course c ON sp.course_code = c.course_code
            JOIN students_Session ss ON sp.id = ss.id_session
            WHERE ss.id_student = ?
        `, [userId]);
        console.log(sesiones);
        return [sesiones];
    } catch (error) {
        console.error('Error al obtener sesiones planificadas:', error);
    }
}

// Reportes de ausencia junto con la información del remitente y del ausente
 async function obtenerReportesDeAusencia() {
    const pool = await crearPoolConexion();
    try {
        const conexion = await pool.getConnection();
        const [reportes] = await conexion.execute(`
            SELECT ar.comment, ar.id_session, u1.username AS 'Sender', u2.username AS 'Absent Party' 
            FROM ausentReport ar 
            JOIN user u1 ON ar.id_sender = u1.id 
            JOIN user u2 ON ar.id_ausentparty = u2.id
        `);
        console.log(reportes);
    } catch (error) {
        console.error('Error al obtener reportes de ausencia:', error);
    }
}

// Estudiantes y su disponibilidad
 async function obtenerDisponibilidadEstudiantes() {
    const pool = await crearPoolConexion();
    try {
        const conexion = await pool.getConnection();
        const [disponibilidad] = await conexion.execute(`
            SELECT u.username, hd.hournumber, hd.day_week 
            FROM hoursdisponibility hd 
            JOIN user u ON hd.studentID = u.id
        `);
        console.log(disponibilidad);
    } catch (error) {
        console.error('Error al obtener disponibilidad de estudiantes:', error);
    }
}

 async function obtenerHorasDisponiblesPersona(id) {
    const conexion = await conn;
    try {
        const [horas] = await conexion.execute(`SELECT * FROM hoursdisponibility WHERE studentID = ?`, [id])
        console.log(horas);
    }
    catch (error) {
        console.error('Error al obtener disponibilidad de estudiantes:', error);
    }
}

 async function ingresarNuevasHoras(hora, day, studentID) {
    const conexion = await conn;
    try {
        const [horas] = await conexion.execute(`INSERT INTO hoursdisponibility(hournumber, day_week, studentID) VALUES(?,?,?)`, [hora, day, studentID])
        console.log(horas);
    }
    catch (error) {
        console.error('Error al obtener disponibilidad de estudiantes:', error);
    }
}

 async function eliminarHoras(hora, day, studentID) {
    const conexion = await conn;
    try {
        const [horas] = await conexion.execute(
            `DELETE FROM hoursdisponibility
            WHERE studentID = ? AND hournumber = ? AND day_week = ?`, 
            [studentID, hora, day])
        console.log(horas);
    }
    catch (error) {
        console.error('Error al obtener disponibilidad de estudiantes:', error);
    }
}

 async function obtenerTipoUsuarioPorId(userId){
    const conexion = await conn;
    try {
        const [resultado] = await conexion.execute(
            `SELECT typeuser FROM user WHERE id=?`,
            [userId]
        )
        return [resultado];
    } catch (error) {
        console.error('Error al obtener el tipo de usuario:' , error);
    }
}

obtenerTipoUsuarioPorId(21231);
// Función para calificar sesion
 async function calificarSesion(calificacion, comentario, id_sender, id_receiver, id_session) {
    const conexion = await conn;
    try {
        const [comentarios] = await conexion.execute(
            `INSERT INTO comment(rating, commentContent, id_sender, id_receiver, id_session)
            VALUES(?,?,?,?,?)`,
            [calificacion, comentario, id_sender, id_receiver, id_session]
        );
        console.log(comentarios)
    } catch (error) {
        console.error('Error al intentar califica session:', error);
    }
}

//calificarSesion(3,'chale',3,4,1);
verSesionesEnCurso();

module.eport = {
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