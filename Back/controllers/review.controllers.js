import { pool } from '../db.js';

// controlador para insertar una review de artículo
export const InsertArticleReview = async (req, res) => {
    try {
        const {
            Num_article_review,
            Date_review,
            Comment_article,
            Num_article,
            Num_user,
            Num_cat_state
        } = req.body;

        const [rows] = await pool.query(
            `CALL InsertArticleReview(?, ?, ?, ?, ?, ?);`,
            [
                Num_article_review,
                Date_review,
                Comment_article,
                Num_article,
                Num_user,
                Num_cat_state
            ]
        );

        const result = rows[0][0];

        res.status(200).json({
            message: result?.message || 'Operación realizada',
            success: result?.success === 1
        });
    } catch (error) {
        console.error('Error al registrar review:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// controlador para obtener todas las reviews de artículos
export const GetArticleReviews = async (req, res) => {
  try {
    const [rows] = await pool.query(`CALL GetArticleReviews();`);

    const reviews = rows[0];

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

export const GetArticleReviewsByUser = async (req, res) => {
  try {
    const { UserName } = req.body;

    const [rows] = await pool.query(`CALL GetArticleReviewsByUser(?);`, [UserName]);

    const reviews = rows[0];

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error al obtener reviews por usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};