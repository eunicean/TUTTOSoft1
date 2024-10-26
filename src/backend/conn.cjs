const { createPool } = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const {
    DATABASEHOSTNAME,
    DATABASEUSERNAME,
    DATABASEPASSWORD,
    DATABASENAME,
    DATABASEPORT
} = process.env;

const pool = createPool({
    host: DATABASEHOSTNAME,
    user: DATABASEUSERNAME,
    password: DATABASEPASSWORD,
    database: DATABASENAME,
    port: DATABASEPORT || 3306, // Usa el puerto desde .env o el puerto predeterminado de MySQL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
console.log("esto prueba que se ejecuto");
module.exports = pool;