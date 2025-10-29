import { Router } from "express";
import * as ReviewController from "../controllers/review.controllers.js";

const router = Router();

router.post("/InsertArticleReview", ReviewController.InsertArticleReview);
router.post("/GetArticleReviews", ReviewController.GetArticleReviews);
router.post("/GetArticleReviewsByUser", ReviewController.GetArticleReviewsByUser);

export default router;