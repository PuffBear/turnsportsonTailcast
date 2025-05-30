import mysql from 'mysql2/promise';
import { config } from 'dotenv';

//load the .env variables
config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
});

// HTTP GET Handler
export async function get({ request}) {
    try {
        // Adjust table/column names to match your schema
        const [rows] = await pool.query(
            ``
        );

        return {
            status: 200, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rows),
        };
    } catch (err) {
        console.error('DB Query error:', err);
        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({error: err.message}), 
        };
    }
} 