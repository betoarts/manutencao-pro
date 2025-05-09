import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
    user: process.env.VITE_DB_USER,
    host: process.env.VITE_DB_HOST,
    database: 'postgres', // Conecta ao banco padrão primeiro
    password: process.env.VITE_DB_PASSWORD,
    port: process.env.VITE_DB_PORT,
});

async function initDatabase() {
    try {
        // Cria o banco de dados se não existir
        await pool.query(`CREATE DATABASE ${process.env.VITE_DB_NAME}`);
        console.log('Banco de dados criado com sucesso!');
    } catch (error) {
        if (error.code === '42P04') {
            console.log('Banco de dados já existe.');
        } else {
            console.error('Erro ao criar banco de dados:', error);
            process.exit(1);
        }
    }

    // Fecha a conexão com o banco padrão
    await pool.end();

    // Conecta ao banco de dados manutencao_pro
    const dbPool = new Pool({
        user: process.env.VITE_DB_USER,
        host: process.env.VITE_DB_HOST,
        database: process.env.VITE_DB_NAME,
        password: process.env.VITE_DB_PASSWORD,
        port: process.env.VITE_DB_PORT,
    });

    try {
        // Lê e executa o arquivo schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await dbPool.query(schema);
        console.log('Schema do banco de dados criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar schema:', error);
        process.exit(1);
    } finally {
        await dbPool.end();
    }
}

initDatabase(); 