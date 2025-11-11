import { useEffect, useState } from 'react';
import FileViewerModal from '../componentes.generales/FileViewerModal';

export default function PublishedArticles({ onClose }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewerUrl, setViewerUrl] = useState('');

  const fetchPublishedArticles = async () => {
    try {
      const apiBase = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';
      const response = await fetch(`${apiBase}/articles/GetArticlesByState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Num_cat_state: 4 }) // Estado 4 para artículos publicados
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but got:', text.substring(0, 100));
        throw new Error('El servidor devolvió un formato inesperado');
      }
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al cargar los artículos');
      }
      
      // Mapear solo los campos que vienen del procedimiento almacenado
      const mappedArticles = (data.articles || []).map(article => ({
        Num_article: article.Num_article,
        Title_article: article.Title_article,
        Summary_article: article.Summary_article,
        Patch_article: article.Patch_article,
        Publication_date: article.Date_publication_article,
        Author_name: `${article.FirstName || ''} ${article.LastName || ''}`.trim(),
        Category_name: article.CategoryName
      }));
      
      console.log('Artículos mapeados:', mappedArticles);
      setArticles(mappedArticles);
      setError('');
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err.message || 'Error al cargar los artículos. Verifica la consola para más detalles.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar datos inmediatamente
    fetchPublishedArticles();
    
    // Configurar intervalo para actualizar cada 5 segundos
    const intervalId = setInterval(() => {
      fetchPublishedArticles();
    }, 5000);
    
    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

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
          <h2 className="text-sm font-semibold text-slate-800">Cargando artículos publicados...</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs rounded-full border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
          )}
        </div>
        <div className="text-sm text-slate-600">Cargando lista de artículos...</div>
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

  const getViewerUrl = (u) => {
    try {
      const base = (u || '').split('?')[0].toLowerCase();
      if (base.endsWith('.pdf')) return u;
      if (base.endsWith('.doc') || base.endsWith('.docx')) {
        return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(u)}`;
      }
    } catch {}
    return u;
  };


  const handlePublishArticle = async (articleId) => {
    try {
      const apiBase = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';
      await fetch(`${apiBase}/articles/UpdateArticleState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Num_article: articleId,
          Num_cat_state: 7 // Estado 7 = Publicado
        })
      });
      
      // Actualizar la lista de artículos después de publicar
      fetchPublishedArticles();
    } catch (error) {
      console.error('Error al publicar el artículo:', error);
    }
  };

  return (
    <div className="mt-6 px-4 md:px-6">
      {viewerUrl && (
        <FileViewerModal url={viewerUrl} onClose={() => setViewerUrl('')} />
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-800">Artículos por Publicar</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cerrar
          </button>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="text-sm text-slate-500">No hay artículos publicados para mostrar.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div key={article.Num_article} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
                  {article.Title_article || 'Artículo sin título'}
                </h3>
                <span className="inline-flex items-center text-xs text-slate-500">
                  <svg className="h-3 w-3 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(article.Publication_date)}
                </span>
              </div>

              {article.Summary_article && (
                <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                  {article.Summary_article}
                </p>
              )}

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-start">
                  <span className="font-medium text-slate-700 w-24">Autor:</span>
                  <span className="text-slate-900 flex items-center">
                    <svg className="h-3.5 w-3.5 mr-1 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {article.Author_name || 'No especificado'}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-slate-700 w-24">Categoría:</span>
                  <span className="text-slate-900">{article.Category_name || 'No especificada'}</span>
                </div>
                {article.Patch_article && (
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={getViewerUrl(article.Patch_article)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Visualizar artículo
                    </a>
                    <a
                      href={article.Patch_article}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center rounded-full bg-[#7B1429] px-3 py-1 text-xs font-medium text-white transition hover:scale-105"
                    >
                      Descargar
                    </a>
                    <button
                      type="button"
                      onClick={() => handlePublishArticle(article.Num_article)}
                      className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800 transition hover:bg-gray-300"
                    >
                      Publicar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
