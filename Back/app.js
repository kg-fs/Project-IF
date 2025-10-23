import express from 'express';
import { pool } from './db.js';
import userRoutes from './routes/users.js';
import articleRoutes from './routes/article.js';

import cors from 'cors';
const app = express();
const port = 3000;
app.use(cors());

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

checkConnection();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});