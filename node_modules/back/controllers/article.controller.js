import { pool } from '../db.js';
import {  generateUniqueArticleId } from '../utils/ArticleId.js';


// controlador para insertar un nuevo articulo
export const NewArticles = async (req, res) => {
    try {
        const {
            Title_article,
            Summary_article,
            Patch_article,
            Date_publication_article,
            Num_cat_article,
            Num_user
        } = req.body;

        // ✅ Generar ID único para el artículo
        const Num_article = await generateUniqueArticleId();

        // ✅ Estado por defecto: 8 (en espera de revisión)
        const Num_cat_state = 8;

        // ✅ Llamar al procedimiento almacenado
        const [rows] = await pool.query(
            `CALL InsertArticle(?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Num_article,
                Title_article,
                Summary_article,
                Patch_article,
                Date_publication_article,
                Num_cat_article,
                Num_user,
                Num_cat_state
            ]
        );

        // ✅ El procedimiento devuelve un SELECT con message y success
        const result = rows[0][0]; // el primer SELECT dentro del CALL

        res.status(200).json({
            message: result.message,
            success: result.success === 1,
            Num_article
        });

    } catch (error) {
        console.error('Error al registrar artículo:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// controlador para obtener artículos filtrados por estado
export const GetArticlesByState = async (req, res) => {
    try {
        const { Num_cat_state } = req.body; // viene desde la URL

        // ✅ Llamar al procedimiento almacenado
        const [rows] = await pool.query(
            `CALL GetArticlesWithUserAndCategoryByState(?);`,
            [Num_cat_state]
        );

        // ✅ El resultado viene en rows[0]
        const articles = rows[0];

        res.status(200).json({
            success: true,
            articles
        });

    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// controlador para obtener un artículo por su ID
export const GetArticleById = async (req, res) => {
    try {
        const { Num_article } = req.body; // viene desde la ruta

        // ✅ Llamar al procedimiento almacenado
        const [rows] = await pool.query(
            `CALL GetArticleWithUserAndCategoryById(?);`,
            [Num_article]
        );

        // ✅ El resultado viene en rows[0]
        const article = rows[0][0]; // solo uno porque filtramos por id

        // Si no existe el artículo
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Artículo no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            article
        });

    } catch (error) {
        console.error('Error al obtener artículo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// controlador para obtener artículos filtrados por categoría
export const GetArticlesByCategory = async (req, res) => {
    try {
        const { Num_cat_article } = req.body; // viene desde la ruta

        // ✅ Llamada al procedimiento almacenado
        const [rows] = await pool.query(
            `CALL GetArticlesWithUserAndCategoryByCategory(?);`,
            [Num_cat_article]
        );

        // Los resultados vienen en rows[0]
        const articles = rows[0];

        res.status(200).json({
            success: true,
            articles
        });

    } catch (error) {
        console.error('Error al obtener artículos por categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// controlador para obtener artículos filtrados por categoría y estado
export const GetArticlesByCategoryAndState = async (req, res) => {
    try {
        const { Num_cat_article, Num_cat_state } = req.body;

        const [rows] = await pool.query(
            `CALL GetArticlesByCategoryAndState(?, ?);`,
            [Num_cat_article, Num_cat_state]
        );

        const articles = rows[0];

        res.status(200).json({
            success: true,
            articles
        });

    } catch (error) {
        console.error('Error al obtener artículos por categoría y estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
