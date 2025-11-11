import { pool } from '../db.js';
import { generateUniqueReviewId } from '../utils/ReviewId.js';

// controlador para insertar una review de artículo
export const InsertArticleReview = async (req, res) => {
    try {
        const {
            Date_review,
            Comment_article,
            Num_article,
            Num_user,
            Num_cat_state
        } = req.body;

        const Num_article_review = await generateUniqueReviewId();

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
    const { UserId } = req.body;

    if (!UserId) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el ID del usuario'
      });
    }

    const [rows] = await pool.query(`CALL GetArticleReviewsByUser(?);`, [UserId]);

    // El procedimiento devuelve los resultados en rows[0]
    const reviews = rows[0] || [];

    res.status(200).json({
      success: true,
      reviews: reviews.map(review => ({
        Num_review: review.Num_article_review,
        Date_review: review.Date_review,
        Comment_article: review.Comment_article,
        Title_article: review.Title_article,
        Summary_article: review.Summary_article,
        Author_name: review.Author_name,
        Category_name: review.Category_name,
        State: review.Review_state_name || review.Num_cat_state,
        Reviewed_by: review.Reviewed_by
      }))
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

