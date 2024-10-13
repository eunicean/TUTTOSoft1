import { createPool } from 'mysql2/promise';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
// console.log('Loaded Environment Variables:', process.env);

const {
    DATABASEHOSTNAME,
    DATABASEUSERNAME,
    DATABASEPASSWORD,
    DATABASENAME,
    DATABASESSLBASE64
} = process.env;

// Optionally, decode SSL certificate from Base64
const certificate = DATABASESSLBASE64 ? Buffer.from(DATABASESSLBASE64, 'base64').toString('utf-8') : undefined;

// Log the database connection settings before attempting to connect
//console.log({
//     Host: DATABASEHOSTNAME,
//     Port: 25060,
//     User: DATABASEUSERNAME,
//     Database: DATABASENAME,
//     SSL_Enabled: !!certificate
//});

// Create the database connection pool
const pool = createPool({
    host: DATABASEHOSTNAME,
    user: DATABASEUSERNAME,
    password: DATABASEPASSWORD,
    database: DATABASENAME,
    port: 25060,
    ssl: certificate ? { ca: certificate } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
