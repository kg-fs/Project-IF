import crypto from 'crypto';
import { pool } from '../db.js';

export function generateUserId() {
    const n = crypto.randomInt(0, 1000000);
    return String(n).padStart(6, '0');
}

export async function generateUniqueUserId({ maxRetries = 10000 } = {}) {
    const table = 'users';
    const column = 'Num_user';

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const id = generateUserId();
        try {
            const [rows] = await pool.query(`SELECT 1 FROM ?? WHERE ?? = ? LIMIT 1`, [table, column, id]);
            if (rows.length === 0) return id;
        } catch (err) {
            throw new Error('error al verificar si el id de usuario es único: ' + err.message);
        }
    }

    throw new Error(`el id generado no es unico ${maxRetries} intentos`);
}

