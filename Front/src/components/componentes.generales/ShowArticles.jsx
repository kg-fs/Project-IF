import { useEffect, useMemo, useState } from 'react';
import FileViewerModal from './FileViewerModal.jsx';

export default function ShowArticles({ refreshInterval = 10000 }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewerUrl, setViewerUrl] = useState('');

  // Guardar: solo Admin (1) o Investigador (2)
  const allowed = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        const r = Number(u?.Num_rol);
        return r === 1 || r === 2 || r === 3;
      }
      const token = localStorage.getItem('token') || localStorage.getItem('jwt');
      if (token && token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const r = Number(payload?.Num_rol);
        return r === 1 || r === 2 || r === 3;
      }
    } catch {}
    return false;
  }, []);

  useEffect(() => {
    if (!allowed) return;
    const apiBase = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';
    let stopped = false;

    const fetchData = async () => {
      setError('');
      try {
        const resp = await fetch(`${apiBase}/articles/GetArticlesByState`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Num_cat_state: 7 }),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || data?.success === false) {
          console.error('[ShowArticles] Backend error:', data);
          setError(data?.message || 'No se pudieron cargar los artículos');
          setArticles([]);
        } else {
          setArticles(Array.isArray(data.articles) ? data.articles : []);
        }
      } catch (e) {
        console.error('[ShowArticles] Network error:', e);
        setError('Error de red al cargar artículos');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    // Primera carga
    setLoading(true);
    fetchData();

    // Polling
    const id = setInterval(() => {
      if (!stopped) fetchData();
    }, Math.max(3000, Number(refreshInterval) || 15000));

    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [allowed, refreshInterval]);

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

  if (!allowed) return null;
  if (loading) {
    return <div className="mt-6 text-sm text-slate-600">Cargando artículos publicados...</div>;
  }
  if (error) {
    return <div className="mt-6 text-sm text-red-600">{error}</div>;
  }
  if (!articles.length) {
    return <div className="mt-6 text-sm text-slate-500">No hay artículos publicados.</div>;
  }

  return (
    <div className="mt-6 px-4 md:px-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {viewerUrl && (
        <FileViewerModal url={viewerUrl} onClose={() => setViewerUrl('')} />
      )}
      {articles.map((a, idx) => {
        const title = a.Title_article || 'Título no disponible';
        const firstName = a.First_name_user || a.FirstName_user || a.FirstName || a.First_name || '';
        const lastName = a.Last_name_user || a.LastName_user || a.LastName || a.Last_name || '';
        const author = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'Autor desconocido';
        const category = a.Name_cat_article || a.CategoryName || a.Name_category || 'Sin categoría';
        const summary = a.Summary_article || a.Summary || a.Resumen || '';
        const rawDate = a.Date_publication_article || '';
        let date = '';
        if (rawDate) {
          const d = new Date(rawDate);
          if (!isNaN(d)) {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            date = `${dd}/${mm}/${yyyy}`;
          }
        }
        const url = a.Patch_article || '';
        const viewUrl = getViewerUrl(url);
        return (
          <article
            key={a.Num_article || idx}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{title}</h3>
            {summary && (
              <p className="mt-1 text-xs text-slate-600 line-clamp-3">{summary}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center text-xs text-slate-600">
                <svg className="h-3 w-3 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {author}
              </span>
              <span className="ml-auto inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {category}
              </span>
            </div>
            {date && (
              <div className="mt-1 flex items-center text-xs text-slate-500">
                <svg className="h-3 w-3 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {date}
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              {url && (
                <>
                  <a
                    href={getViewerUrl(url)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Visualizar artículo
                  </a>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center rounded-full bg-[#7B1429] px-3 py-1 text-xs font-medium text-white transition hover:scale-105"
                  >
                    Descargar
                  </a>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
