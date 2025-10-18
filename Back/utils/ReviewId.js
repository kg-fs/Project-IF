import crypto from 'crypto';
import { pool } from '../db.js';


export function generateReviewId() {
    const n = crypto.randomInt(0, 10000);
    return String(n).padStart(4, '0');
}

export async function generateUniqueReviewId({ maxRetries = 10000 } = {}) {
    const table = 'Article_review';
    const column = 'Num_article_review';

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const id = generateReviewId();
        try {
            const [rows] = await pool.query(`SELECT 1 FROM ?? WHERE ?? = ? LIMIT 1`, [table, column, id]);
            if (rows.length === 0) return id;
        } catch (err) {
            throw new Error('error al verificar si el id de revision es único: ' + err.message);
        }
    }
    throw new Error(`el id generado no es único ${maxRetries} intentos`);
}