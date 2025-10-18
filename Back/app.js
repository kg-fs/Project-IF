import express from 'express';
import { pool } from './db.js';
import userRoutes from './routes/users.js';
import articleRoutes from './routes/article.js';
import { generateUniqueUserId } from './utils/UserId.js';
import { generateUniqueReviewId } from './utils/ReviewId.js';
import { generateUniqueArticleId } from './utils/ArticleId.js';
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
const id = await generateUniqueUserId();
const reviewId = await generateUniqueReviewId();
const articleId = await generateUniqueArticleId();

console.log('Generated Unique User ID:', id);
console.log('Generated Unique Review ID:', reviewId);
console.log('Generated Unique Article ID:', articleId);
app.use('/users', userRoutes);
app.use('/articles', articleRoutes);

checkConnection();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});