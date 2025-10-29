import { Router } from "express";  
import * as ArticleController from "../controllers/article.controller.js";
const router = Router();

router.post("/NewArticles", ArticleController.NewArticles);
router.post("/GetArticlesByState", ArticleController.GetArticlesByState);
router.post("/GetArticleById", ArticleController.GetArticleById);
router.post("/GetArticlesByCategory", ArticleController.GetArticlesByCategory);
router.post("/GetArticlesByCategoryAndState", ArticleController.GetArticlesByCategoryAndState);

export default router;