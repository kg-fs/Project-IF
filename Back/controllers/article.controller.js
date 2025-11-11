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

// controlador para obtener artículos filtrados por nombre y apellido del usuario autor
export const GetArticlesByUserName = async (req, res) => {
    try {
        const { First_name_user, Last_name_user, FirstName, LastName } = req.body;
        const p_FirstName = First_name_user ?? FirstName ?? null;
        const p_LastName = Last_name_user ?? LastName ?? null;

        const [rows] = await pool.query(
            `CALL GetArticlesWithUserAndCategoryByName(?, ?);`,
            [p_FirstName, p_LastName]
        );

        const articles = rows[0];

        res.status(200).json({
            success: true,
            articles
        });
    } catch (error) {
        console.error('Error al obtener artículos por nombre de autor:', error);
        res.status(500).json({
            success: false,
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

// controlador para actualizar el estado de un artículo
export const UpdateArticleState = async (req, res) => {
    console.log('=== INICIO UpdateArticleState ===');
    console.log('Cuerpo de la solicitud recibida:', req.body);
    
    // Verificar si el cuerpo de la solicitud está vacío
    if (!req.body || Object.keys(req.body).length === 0) {
        console.error('Error: Cuerpo de la solicitud vacío');
        return res.status(400).json({
            success: false,
            message: 'El cuerpo de la solicitud no puede estar vacío',
            error: 'REQUEST_BODY_EMPTY'
        });
    }

    const connection = await pool.getConnection().catch(err => {
        console.error('Error al obtener conexión de la pool:', err);
        return res.status(500).json({
            success: false,
            message: 'Error al conectar con la base de datos',
            error: err.message
        });
    });

    try {
        // Extraer y validar parámetros
        const Num_article = parseInt(req.body.Num_article);
        const Num_cat_state = parseInt(req.body.Num_cat_state);

        console.log('Parámetros recibidos:', { Num_article, Num_cat_state });

        // Validar que se proporcionen los parámetros necesarios
        if (isNaN(Num_article) || isNaN(Num_cat_state)) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren los parámetros Num_article y Num_cat_state y deben ser números válidos',
                received: {
                    Num_article: req.body.Num_article,
                    Num_cat_state: req.body.Num_cat_state,
                    body: req.body
                },
                error: 'INVALID_PARAMETERS'
            });
        }

        console.log('Iniciando transacción...');
        await connection.beginTransaction();

        try {
            console.log('Deshabilitando advertencias de MySQL...');
            await connection.query('SET SESSION sql_notes = 0;');
            
            console.log('Llamando al procedimiento almacenado...');
            const [result] = await connection.query(
                'CALL UpdateArticleState(?, ?)',
                [Num_article, Num_cat_state]
            );
            
            console.log('Resultado del procedimiento:', result);
            
            console.log('Habilitando advertencias de MySQL...');
            await connection.query('SET SESSION sql_notes = 1;');
            
            console.log('Confirmando transacción...');
            await connection.commit();

            // Respuesta exitosa
            const response = {
                success: true,
                message: 'Estado del artículo actualizado correctamente',
                data: {
                    Num_article,
                    Num_cat_state,
                    affectedRows: result.affectedRows
                }
            };

            console.log('Enviando respuesta exitosa:', response);
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(response);

        } catch (dbError) {
            console.error('Error en la transacción:', dbError);
            if (connection) {
                console.log('Deshaciendo transacción...');
                await connection.rollback().catch(rollbackErr => {
                    console.error('Error al hacer rollback:', rollbackErr);
                });
            }
            throw dbError;
        }

    } catch (error) {
        console.error('Error general en UpdateArticleState:', error);
        
        // Determinar el código de estado apropiado
        let statusCode = 500;
        let errorMessage = 'Error interno del servidor al actualizar el estado del artículo';
        let errorCode = 'INTERNAL_SERVER_ERROR';
        
        if (error.code === 'ER_NO_REFERENCED_ROW' || error.code === 'ER_NO_REFERENCED_ROW_2') {
            statusCode = 404;
            errorMessage = 'Artículo no encontrado';
            errorCode = 'ARTICLE_NOT_FOUND';
        } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
            statusCode = 400;
            errorMessage = 'Parámetros inválidos';
            errorCode = 'INVALID_PARAMETERS';
        }
        
        const errorResponse = {
            success: false,
            message: errorMessage,
            error: error.message,
            code: errorCode,
            ...(process.env.NODE_ENV === 'development' && {
                stack: error.stack,
                sql: error.sql,
                sqlMessage: error.sqlMessage,
                sqlState: error.sqlState
            })
        };
        
        res.setHeader('Content-Type', 'application/json');
        return res.status(statusCode).json(errorResponse);
        
    } finally {
        if (connection) {
            console.log('Liberando conexión...');
            await connection.release().catch(releaseErr => {
                console.error('Error al liberar la conexión:', releaseErr);
            });
        }
        console.log('=== FIN UpdateArticleState ===\n');
    }
};