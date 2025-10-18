import pkg from 'mysql2/promise';
const { createPool } = pkg;

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'project_if',
});
