import pkg from 'mysql2/promise';
import dotenv from "dotenv";
const { createPool } = pkg;
dotenv.config();
export const pool = createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port:Number(process.env.DB_PORT || 3306),
    database:process.env.DB_NAME,
});
