import express from 'express';
import { pool } from './db.js';
import userRoutes from './routes/users.js';
import articleRoutes from './routes/article.js';
import reviewRoutes from './routes/review.js';
import { generateUniqueUserId } from './utils/UserId.js';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const checkConnection = async () => {
    try {
        await pool.getConnection();
        console.log('Conexión a MySQL exitosa ✅');
    } catch (err) {
        console.error('Error de conexión a MySQL ❌', err);
    }
};

app.use('/users', userRoutes);
app.use('/articles', articleRoutes);
app.use('/reviews', reviewRoutes);

checkConnection();
const user = async () => {
    const userId = await generateUniqueUserId();
    console.log(userId);
}
// user();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});