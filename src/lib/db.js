import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: import.meta.env.VITE_DB_USER,
    host: import.meta.env.VITE_DB_HOST,
    database: import.meta.env.VITE_DB_NAME,
    password: import.meta.env.VITE_DB_PASSWORD,
    port: import.meta.env.VITE_DB_PORT,
});

export default pool; 