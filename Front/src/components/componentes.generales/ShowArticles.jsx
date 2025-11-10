import { useEffect, useMemo, useState } from 'react';

export default function ShowArticles({ refreshInterval = 10000 }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Guardar: solo Admin (1) o Investigador (2)
  const allowed = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        const r = Number(u?.Num_rol);
        return r === 1 || r === 2;
      }
      const token = localStorage.getItem('token') || localStorage.getItem('jwt');
      if (token && token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const r = Number(payload?.Num_rol);
        return r === 1 || r === 2;
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
              <span className="text-xs text-slate-600">{author}</span>
              <span className="ml-auto inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                {category}
              </span>
            </div>
            {date && <div className="mt-1 text-[11px] text-slate-500">{date}</div>}

            <div className="mt-3 flex items-center gap-2">
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center rounded-full bg-[#7B1429] px-3 py-1 text-xs font-medium text-white transition hover:scale-105"
                >
                  Descargar
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
