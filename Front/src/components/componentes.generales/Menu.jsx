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
      <div className="flex items-center gap-4">
        <a href="#" className="text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise">Dashboard</a>
        <a
          href="#"
          onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('show-review-articles')); }}
          className="text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
        >
          Reviews
        </a>
        <a href="#" className="text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise">Publicación de artículos</a>
        <a
          href="#"
          onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('show-admin-users')); }}
          className="text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
        >
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
        <div className="flex items-center gap-4">
          <a
            href="#"
            onClick={(e)=>{ e.preventDefault(); setOpen(true); }}
            className="text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
          >
            Agregar artículo
          </a>
          <a
            href="#"
            onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('show-my-articles')); }}
            className="text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise"
          >
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
      <div className="flex items-center gap-4">
        <a href="#" className="text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise">Evaluar artículos</a>
        <a href="#" className="text-slate-700 hover:text-slate-900 text-xs font-medium transition link-raise">Artículos en revisión</a>
      </div>
    );
  }

  // Otros roles: por ahora, sin acciones (se agregarán luego)
  return null;
}
