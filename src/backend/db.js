import conn from './conn.js'

// Función para buscar un usuario por email
export async function buscarUsuarioPorEmail(email) {
    const conexion = await conn;
    try {
        const [usuarios] = await conexion.execute(`SELECT * FROM user WHERE email = '${email}'`);
        console.log(usuarios);
    } catch (error) {
        console.error('Error al buscar usuario:', error);
    }
}
buscarUsuarioPorEmail('mariaa@uvg.edu.gt')
export async function verificarUsuario(email,constrasenia) {
    const conexion = await conn;
    try {
        const [usuarios] = await conexion.execute(`SELECT * FROM user WHERE email = '${email}' AND password = '${constrasenia}'`);
        console.log(usuarios);
        let result;
        if (usuarios.length > 0) {
            result = 'true';
        } else {
            result = 'false';
        }
        console.log(result);

    } catch (error) {
        console.error('Datos incorrectos del usuario:', error);
    }
}
verificarUsuario('mariaa@uvg.edu.gt', 'hash2')

// Función para crear un nuevo usuario
export async function crearUsuario(id, username, email) {
    const conexion = await conn;
    try {
        const [result] = await conexion.execute(`INSERT INTO user (id, username, email) VALUES (${id}, '${username}', '${email}')`);
        console.log(result);
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }
}

// Función para eliminar un usuario por ID
export async function eliminarUsuarioPorID(id) {
    const conexion = await conn;
    try {
        const [result] = await conexion.execute(`Delete from user where ID = ${id}`);
        console.log(result);
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}

// Función para borrar chats con un usuario
export async function borrarChatsConUsuario(idChat) {
    const conexion = await conn;
    try {
        const [usuarios] = await conexion.execute(`DELETE FROM chat_integrants WHERE id_chat = ${idChat}`);
        console.log(usuarios);
    } catch (error) {
        console.error('Error al borrar chats:', error);
    }
}

// Función para ver sesiones en curso
export async function verSesionesEnCurso() {
    const conexion = await conn;
    try {
        const [sesion] = await conexion.execute(`SELECT * FROM sessionPlanned WHERE dated = CURDATE() AND start_hour <= CURTIME() AND end_hour >= CURTIME()`);
        console.log(sesion);
    } catch (error) {
        console.error('Error al ver sesiones en curso:', error);
    }
} //changes to do: add the userId to the sessionTo list, change from curdate from dated to list all the 

// Función para borrar una sesión
export async function borrarSesion(date) {
    const conexion = await conn;
    try {
        const [sesion] = await conexion.execute(`DELETE FROM sessionPlanned WHERE dated = '${date}'`);
        console.log(sesion);
    } catch (error) {
        console.error('Error al borrar sesión:', error);
    }
}

// Todos los usuarios que son estudiantes
export async function obtenerEstudiantes() {
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
export async function obtenerMensajesDeChat(idChat) {
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
export async function obtenerSesionesPlanificadas() {
    const pool = await crearPoolConexion();
    try {
        const conexion = await pool.getConnection();
        const [sesiones] = await conexion.execute(`
            SELECT sp.id, c.namecourse, sp.dated, sp.start_hour, sp.end_hour, sp.mode 
            FROM sessionPlanned sp 
            JOIN course c ON sp.course_code = c.course_code
        `);
        console.log(sesiones);
    } catch (error) {
        console.error('Error al obtener sesiones planificadas:', error);
    }
}

// Reportes de ausencia junto con la información del remitente y del ausente
export async function obtenerReportesDeAusencia() {
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
export async function obtenerDisponibilidadEstudiantes() {
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

export async function obtenerHorasDisponiblesPersona(id) {
    const conexion = await conn;
    try {
        const [horas] = await conexion.execute(`SELECT * FROM hoursdisponibility WHERE studentID = ?`, [id])
        console.log(horas);
    }
    catch (error) {
        console.error('Error al obtener disponibilidad de estudiantes:', error);
    }
}

export async function ingresarNuevasHoras(hora, day, studentID) {
    const conexion = await conn;
    try {
        const [horas] = await conexion.execute(`INSERT INTO hoursdisponibility(hournumber, day_week, studentID) VALUES(?,?,?)`, [hora, day, studentID])
        console.log(horas);
    }
    catch (error) {
        console.error('Error al obtener disponibilidad de estudiantes:', error);
    }
}

export async function eliminarHoras(hora, day, studentID) {
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