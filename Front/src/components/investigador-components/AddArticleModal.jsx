import { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient.js';

export default function AddArticleModal({ open, onClose, categories = [] }) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  }, [open]);

  // Cierre automático de la modal 3s después del éxito
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 3000);
    return () => clearTimeout(t);
  }, [successMsg, onClose]);

  const catOptions = useMemo(() => Array.isArray(categories) ? categories : [], [categories]);

  if (!open) return null;

  const BUCKET = import.meta.env.PUBLIC_SUPABASE_BUCKET || 'investigaciones';
  const apiBase = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';
  const allowedTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]);
  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSuccessMsg('');
    try {
      if (!title.trim() || !summary.trim() || !file || !category) {
        setError('Completa todos los campos.');
        return;
      }
      if (!allowedTypes.has(file.type)) {
        setError('Formato no permitido. Solo PDF o Word.');
        return;
      }
      if (file.size > MAX_BYTES) {
        setError('El archivo supera 5 MB. Selecciona uno más pequeño.');
        return;
      }
      setSubmitting(true);

      const rawUser = localStorage.getItem('user');
      const numUser = rawUser ? JSON.parse(rawUser)?.Num_user : null;
      if (!numUser) {
        setError('No se encontró el usuario. Inicia sesión nuevamente.');
        return;
      }

      const extMatch = file.name.match(/\.[a-zA-Z0-9]+$/);
      const ext = extMatch ? extMatch[0].toLowerCase() : '';
      const slug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '')
        .slice(0, 60);
      const ts = Date.now();
      // La key es la ruta DENTRO del bucket, no incluye el nombre del bucket
      const key = `${numUser}/${ts}_${slug}${ext}`;

      const supabase = getSupabase();
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(key, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined,
      });
      if (upErr) {
        setError(`Error al subir archivo a Supabase: ${upErr.message || ''}`);
        return;
      }
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(key);
      const patchUrl = pub?.publicUrl || key;

      const resp = await fetch(`${apiBase}/articles/NewArticles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Title_article: title.trim(),
          Summary_article: summary.trim(),
          Patch_article: patchUrl,
          Date_publication_article: date,
          Num_cat_article: Number(category),
          Num_user: numUser,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data?.success === false) {
        setError(data?.message || 'No se pudo guardar el artículo.');
        return;
      }

      setTitle('');
      setSummary('');
      setFile(null);
      setCategory('');
      setSuccessMsg('Artículo guardado exitosamente.');
    } catch (err) {
      setError('Error inesperado al guardar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white p-4 shadow-xl max-h-[60vh] overflow-y-auto">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Agregar artículo</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-sm">✕</button>
        </div>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#7B1429] focus:border-[#7B1429]"
              placeholder="Título del artículo"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Resumen</label>
            <textarea
              value={summary}
              onChange={(e)=>setSummary(e.target.value)}
              className="w-full min-h-[80px] rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#7B1429] focus:border-[#7B1429]"
              placeholder="Resumen breve"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Archivo</label>
            <input
              type="file"
              onChange={(e)=>setFile(e.target.files?.[0] || null)}
              className="block w-full text-xs text-slate-700 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2.5 file:py-1.5 file:text-xs hover:file:bg-slate-200"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Fecha de publicación</label>
              <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">
                {date}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#7B1429] focus:border-[#7B1429]"
                required
              >
                <option value="" disabled>Selecciona</option>
                {catOptions.map(c => (
                  <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
          {successMsg && <div className="text-xs text-green-600">{successMsg}</div>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="text-slate-700 hover:text-slate-900 text-xs">Cancelar</button>
            <button type="submit" disabled={submitting} className="inline-flex items-center justify-center rounded-full bg-[#7B1429] text-white px-4 py-1.5 text-xs font-semibold hover:scale-105 transition disabled:opacity-60">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
