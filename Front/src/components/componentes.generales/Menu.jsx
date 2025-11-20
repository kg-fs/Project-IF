import { useEffect, useState } from 'react';
import AddArticleModal from '../investigador-components/AddArticleModal.jsx';

export default function Menu() {
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setRole(Number(u?.Num_rol));
        return;
      }
      const token = localStorage.getItem('token') || localStorage.getItem('jwt');
      if (token && token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(Number(payload?.Num_rol));
      }
    } catch {}
  }, []);

  // Administrador (1): acciones de administración
  if (role === 1) {
    return (
      <div className="flex items-center gap-6">
        <a
          href="#"
          onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('show-review-articles')); }}
          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reviews
        </a>
        <a
          href="#"
          onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('show-publish-article')); }}
          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Publicar Artículos
        </a>
        <a
          href="#"
          onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('show-admin-users')); }}
          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Usuarios
        </a>
      </div>
    );
  }

  // Investigador (2): mostrar acciones de artículos
  if (role === 2) {
    const categories = [
      { id: 1, name: 'Tecnología' },
      { id: 2, name: 'Ciencia' },
      { id: 3, name: 'Salud' },
      { id: 4, name: 'Educación' },
      { id: 5, name: 'Cultura' },
      { id: 6, name: 'Deportes' },
      { id: 7, name: 'Política' },
      { id: 8, name: 'Economía' },
      { id: 9, name: 'Entretenimiento' },
      { id: 10, name: 'Medio Ambiente' },
      { id: 11, name: 'Historia' },
      { id: 12, name: 'Viajes' },
      { id: 13, name: 'Gastronomía' },
      { id: 14, name: 'Moda' },
      { id: 15, name: 'Ciencia Ficción' },
      { id: 16, name: 'Negocios' },
      { id: 17, name: 'Arte' },
      { id: 18, name: 'Música' },
      { id: 19, name: 'Literatura' },
      { id: 20, name: 'Innovación' },
    ];
    return (
      <>
        <div className="flex items-center gap-6">
          <a
            href="#"
            onClick={(e)=>{ e.preventDefault(); setOpen(true); }}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar artículo
          </a>
          <a
            href="#"
            onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('show-my-articles')); }}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Mis artículos
          </a>
        </div>
        <AddArticleModal open={open} onClose={()=>setOpen(false)} categories={categories} />
      </>
    );
  }

  // Revisor (3): acciones de revisión
  if (role === 3) {
    return (
      <div className="flex items-center gap-6">
        <a
          href="#"
          onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('show-revisor-evaluate')); }}
          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Evaluar artículos
        </a>
        <a
          href="#"
          onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('show-my-reviews')); }}
          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Mis evaluaciones
        </a>
      </div>
    );
  }

  // Otros roles: por ahora, sin acciones (se agregarán luego)
  return null;
}
