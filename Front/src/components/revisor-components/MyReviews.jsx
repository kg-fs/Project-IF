import { useEffect, useState } from 'react';

export default function MyReviews({ onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = localStorage.getItem('token') || localStorage.getItem('jwt');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!user?.Email) {
          throw new Error('No se encontró la información del usuario');
        }

        const userId = user.Num_user || user.id || user.userId;
        if (!userId) {
          throw new Error('No se encontró el ID del usuario');
        }
        
        const response = await fetch('http://localhost:3000/reviews/GetArticleReviewsByUser', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ UserId: userId })
        });
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar las revisiones');
        }

        setReviews(data.reviews || []);
        
      } catch (err) {
        console.error('Error al cargar las revisiones:', err);
        setError(err.message || 'Ocurrió un error al cargar las revisiones');
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 px-4 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Mis Revisiones</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-xs rounded-full border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        )}
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay revisiones</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron revisiones asignadas a tu cuenta.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article 
              key={review.Num_review} 
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
                  {review.Title_article || 'Artículo sin título'}
                </h3>

                {review.Summary_article && (
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {review.Summary_article}
                  </p>
                )}

                {review.Comment_article && (
                  <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600">
                    <p className="font-medium text-slate-700">Tu revisión:</p>
                    <p className="line-clamp-3">{review.Comment_article}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {review.Category_name && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {review.Category_name}
                    </span>
                  )}
                  {review.Author_name && (
                    <span className="inline-flex items-center text-xs text-slate-500">
                      <svg className="h-3 w-3 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {review.Author_name}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center text-xs text-slate-500">
                  <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(review.Date_review) || 'Sin fecha'}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}