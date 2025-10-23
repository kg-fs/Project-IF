import crypto from 'crypto';
import { pool } from '../db.js';


export function generateArticleId() {
    const n = crypto.randomInt(0, 100000); // 0..99999
    return String(n).padStart(5, '0');
}


export async function generateUniqueArticleId({ maxRetries = 10000 } = {}) {
    const table = 'Article';
    const column = 'Num_article';
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const id = generateArticleId();
        try {
            const [rows] = await pool.query(`SELECT 1 FROM ?? WHERE ?? = ? LIMIT 1`, [table, column, id]);
            if (rows.length === 0) return id;
        } catch (err) {
            throw new Error('error al verificar si el id de artículo es único: ' + err.message);
        }
    }
    throw new Error(`el id generado no es único después de ${maxRetries} intentos`);
}