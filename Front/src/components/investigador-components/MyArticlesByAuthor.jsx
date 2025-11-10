import { useEffect, useMemo, useState } from 'react';

export default function MyArticlesByAuthor({ onClose, refreshInterval = 10000 }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { firstName, lastName } = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        return {
          firstName: u?.First_name_user || u?.FirstName_user || u?.FirstName || u?.First_name || '',
          lastName: u?.Last_name_user || u?.LastName_user || u?.LastName || u?.Last_name || '',
        };
      }
      const token = localStorage.getItem('token') || localStorage.getItem('jwt');
      if (token && token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          firstName: payload?.First_name_user || payload?.FirstName || '',
          lastName: payload?.Last_name_user || payload?.LastName || '',
        };
      }
    } catch {}
    return { firstName: '', lastName: '' };
  }, []);

  useEffect(() => {
    const apiBase = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';
    let stopped = false;

    const fetchMine = async () => {
      if (stopped) return;
      
      setLoading(true);
      setError('');
      try {
        const body = {
          First_name_user: firstName || undefined,
          Last_name_user: lastName || undefined,
          FirstName: firstName || undefined,
          LastName: lastName || undefined,
        };
        const resp = await fetch(`${apiBase}/articles/GetArticlesByAuthorName`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || data?.success === false) {
          setError(data?.message || 'No se pudieron cargar tus artículos');
          setArticles([]);
        } else {
          setArticles(Array.isArray(data.articles) ? data.articles : []);
        }
      } catch (e) {
        setError('Error de red al cargar tus artículos');
        setArticles([]);
      } finally {
        if (!stopped) {
          setLoading(false);
          setLastUpdate(new Date());
        }
      }
    };

    if (!firstName && !lastName) {
      setLoading(false);
      setArticles([]);
      return;
    }

    // Carga inicial
    fetchMine();
    
    // Configurar intervalo para actualizaciones periódicas
    const intervalId = setInterval(fetchMine, refreshInterval);
    
    // Limpieza
    return () => {
      stopped = true;
      clearInterval(intervalId);
    };
  }, [firstName, lastName, refreshInterval]);

  const formatDate = (raw) => {
    if (!raw) return '';
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className="mt-6 px-4 md:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Mis artículos</h2>
        <button onClick={onClose} className="text-xs rounded-full border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50">Cerrar</button>
      </div>
      {loading && <div className="text-sm text-slate-600">Cargando tus artículos...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !error && (
        articles.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, idx) => {
              const title = a.Title_article || 'Título no disponible';
              const category = a.Name_cat_article || a.CategoryName || a.Name_category || 'Sin categoría';
              const summary = a.Summary_article || a.Summary || a.Resumen || '';
              const date = formatDate(a.Date_publication_article);
              const url = a.Patch_article || '';
              return (
                <article key={a.Num_article || idx} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{title}</h3>
                  {summary && <p className="mt-1 text-xs text-slate-600 line-clamp-3">{summary}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="ml-auto inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600">{category}</span>
                  </div>
                  {date && <div className="mt-1 text-[11px] text-slate-500">{date}</div>}
                  <div className="mt-3 flex items-center gap-2">
                    {url && (
                      <a href={url} target="_blank" rel="noreferrer" download className="inline-flex items-center rounded-full bg-[#7B1429] px-3 py-1 text-xs font-medium text-white transition hover:scale-105">
                        Descargar
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-slate-500">No tienes artículos.</div>
        )
      )}
    </div>
  );
}
