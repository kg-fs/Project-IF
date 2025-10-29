# API Testing Guide (Postman)

Base URL
- Local: http://localhost:3000
- Common headers:
  - Content-Type: application/json

Postman setup
- Create an Environment with `baseUrl = http://localhost:3000`.
- Use `{{baseUrl}}` in request URLs.

# Articles

- POST {{baseUrl}}/articles/NewArticles
  - Body (JSON):
    {
      "Title_article": "Título de ejemplo",
      "Summary_article": "Resumen breve del artículo",
      "Patch_article": "/uploads/imagen.jpg",
      "Date_publication_article": "2025-10-28",
      "Num_cat_article": 3,
      "Num_user": 45,
      "Num_cat_state": 1
    }
  - Notes:
    - `Num_article` is generated in backend.
    - Date format: YYYY-MM-DD.

- POST {{baseUrl}}/articles/GetArticlesByState
  - Body:
    { "Num_cat_state": 1 }

- POST {{baseUrl}}/articles/GetArticleById
  - Body:
    { "Num_article": 123 }

- POST {{baseUrl}}/articles/GetArticlesByCategory
  - Body:
    { "Num_cat_article": 3 }

- POST {{baseUrl}}/articles/GetArticlesByCategoryAndState
  - Body:
    { "Num_cat_article": 3, "Num_cat_state": 1 }

# Reviews

- POST {{baseUrl}}/reviews/InsertArticleReview
  - Body:
    {
      "Num_article_review": 1001,
      "Date_review": "2025-10-28",
      "Comment_article": "Excelente artículo",
      "Num_article": 123,
      "Num_user": 45,
      "Num_cat_state": 1
    }
  - Notes:
    - Procedure prevents duplicate review by same user for same article.

- POST {{baseUrl}}/reviews/GetArticleReviews
  - Body: {}
  - Notes: Returns all reviews with article title and user name.

- POST {{baseUrl}}/reviews/GetArticleReviewsByUser
  - Body:
    { "UserName": "Juan" }
  - Notes: Partial name match on user's full name.

# Expected responses
- Success (typical):
  - Inserts/actions: { "message": "...", "success": true, ... }
  - Lists: { "success": true, "articles": [...] } or { "success": true, "reviews": [...] }
- Error:
  - { "success": false, "message": "Error interno del servidor", "error": "<detalle>" }

# cURL snippets (optional)
- Insert review:
  curl -X POST {{baseUrl}}/reviews/InsertArticleReview \
    -H "Content-Type: application/json" \
    -d '{
      "Num_article_review": 1001,
      "Date_review": "2025-10-28",
      "Comment_article": "Excelente artículo",
      "Num_article": 123,
      "Num_user": 45,
      "Num_cat_state": 1
    }'

- List all reviews:
  curl -X POST {{baseUrl}}/reviews/GetArticleReviews \
    -H "Content-Type: application/json" \
    -d '{}'

- Reviews by user:
  curl -X POST {{baseUrl}}/reviews/GetArticleReviewsByUser \
    -H "Content-Type: application/json" \
    -d '{ "UserName": "Juan" }'
