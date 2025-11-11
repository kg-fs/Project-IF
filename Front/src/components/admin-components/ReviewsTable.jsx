import { useEffect, useState } from 'react';

export default function ReviewsTable({ onClose, refreshInterval = 30000 }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewerUrl, setViewerUrl] = useState('');

  const fetchReviews = async () => {
    try {
      const apiBase = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';
      const response = await fetch(`${apiBase}/reviews/GetArticleReviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) // Empty object as the endpoint might expect a body
      });
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but got:', text.substring(0, 100));
        throw new Error('El servidor devolvió un formato inesperado');
      }
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al cargar las revisiones');
      }
      
      setReviews(data.reviews || []);
      setError('');
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Error al cargar las revisiones. Verifica la consola para más detalles.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    
    const interval = setInterval(fetchReviews, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('es-ES', { month: 'short' });
    const year = date.getFullYear();
    
    // Check if time is 00:00
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    if (hours === 0 && minutes === 0) {
      return `${day} ${month} ${year}`;
    }
    
    // Format time with leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${day} ${month} ${year} • ${formattedHours}:${formattedMinutes}`;
  };

  if (loading) {
    return (
      <div className="mt-6 px-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Cargando revisiones...</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs rounded-full border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
          )}
        </div>
        <div className="text-sm text-slate-600">Cargando lista de revisiones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 px-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Error</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs rounded-full border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
          )}
        </div>
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="mt-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-800">Todas las revisiones</h2>
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
        <div className="text-sm text-slate-500">No hay revisiones para mostrar.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.Num_review} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
                  {review.Title_article || 'Artículo sin título'}
                </h3>
                <span className="inline-flex items-center text-xs text-slate-500">
                  <svg className="h-3 w-3 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(review.Date_review)}
                </span>
              </div>

              {review.Summary_article && (
                <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                  {review.Summary_article}
                </p>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14.016q2.531 0 5.273 1.102t2.742 2.883v2.016h-16.031v-2.016q0-1.781 2.742-2.883t5.273-1.102zM12 12q-1.922 0-3.305-1.383t-1.383-3.305 1.383-3.305 3.305-1.383 3.305 1.383 1.383 3.305-1.383 3.305-3.305 1.383z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-slate-900">
                      {review.Reviewed_by || 'Revisor anónimo'}
                    </p>
                    {review.Reviewer_email && (
                      <p className="text-xs text-slate-500 truncate">
                        {review.Reviewer_email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {review.Comment_article && (
                <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-600">
                  <p className="font-medium text-slate-700">Comentario:</p>
                  <p className="line-clamp-3">{review.Comment_article}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
