// import dotenv from 'dotenv';
const dotenv = require('dotenv')

dotenv.config(); // Load variables from .env file

const { DATABASEHOSTNAME, DATABASEUSERNAME, DATABASEPASSWORD, DATABASENAME, DATABASEPORT } = process.env;

const pool = createPool({
    host: DATABASEHOSTNAME,
    user: DATABASEUSERNAME,
    password: DATABASEPASSWORD,
    database: DATABASENAME,
    port: DATABASEPORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
