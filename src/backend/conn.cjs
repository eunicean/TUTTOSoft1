const { createPool } = require('mysql2/promise');
const dotenv = require('dotenv');

// Cargar el archivo .env
dotenv.config({ path: './.env' });

// Extraer variables de entorno
const {
    DATABASE_HOSTNAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    DATABASE_PORT
} = process.env;

// Configurar el pool de conexiones
const pool = createPool({
    host: DATABASE_HOSTNAME || 'localhost', // Valor por defecto 'localhost' si no se proporciona en .env
    user: DATABASE_USERNAME || 'root',      // Valor por defecto 'root' si no se proporciona en .env
    password: DATABASE_PASSWORD || '',      // Valor por defecto '' si no se proporciona en .env
    database: DATABASE_NAME || '',          // Valor por defecto '' si no se proporciona en .env
    port: DATABASE_PORT ? Number(DATABASE_PORT) : 3306, // Convertir a número y usar 3306 como puerto predeterminado
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("esto prueba que se ejecutó");
console.log(DATABASE_USERNAME);
module.exports = pool;
