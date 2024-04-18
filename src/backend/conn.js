import { createPool } from 'mysql2/promise';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const {
    DATABASEHOSTNAME,
    DATABASEUSERNAME,
    DATABASEPASSWORD,
    DATABASENAME,
    DATABASECERTIFICATE
} = process.env;

// Crear el pool de conexiones
const pool = createPool({
    host: DATABASEHOSTNAME,
    user: DATABASEUSERNAME,
    password: DATABASEPASSWORD,
    database: DATABASENAME,
    port: 25060,
    ssl: {
        ca: DATABASECERTIFICATE
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool