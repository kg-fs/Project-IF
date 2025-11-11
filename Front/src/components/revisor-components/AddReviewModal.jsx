import { useState, useEffect } from 'react';

export default function AddReviewModal({ open, onClose, articleId, onSubmit }) {
  const [comment, setComment] = useState('');
  // Estados: 4 = Aprobado, 5 = Rechazado
  const [status, setStatus] = useState('4'); 
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    // Validaciones básicas
    if (!comment.trim()) {
      setError('Por favor escribe un comentario');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    const apiBase = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';
    const token = localStorage.getItem('token') || localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user?.Num_user) {
      setError('No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.');
      setSubmitting(false);
      return;
    }

    try {
      // 1. Crear la revisión - Ruta: /reviews/InsertArticleReview
      const reviewResponse = await fetch(`${apiBase}/reviews/InsertArticleReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Date_review: date,
          Comment_article: comment,
          Num_article: articleId,
          Num_user: user.Num_user,
          Num_cat_state: 1 // 1 = Activo (estado de la revisión)
        })
      });

      // Verificar si la revisión se creó correctamente
      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al guardar la revisión');
      }

      // 2. Actualizar el estado del artículo - Ruta: /articles/UpdateArticleState
      const updateResponse = await fetch(`${apiBase}/articles/UpdateArticleState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Num_article: articleId,
          Num_cat_state: parseInt(status) // 4 = Aprobado, 5 = Rechazado (estado del artículo)
        })
      });

      // Verificar si se actualizó el estado correctamente
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar el estado del artículo');
      }

      // Si todo salió bien, cerramos el modal
      onClose(true);
      
    } catch (err) {
      console.error('Error al procesar la revisión:', err);
      setError(err.message || 'Ocurrió un error al procesar tu solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Agregar Revisión</h2>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-700 text-sm"
            disabled={submitting}
          >
            ✕
          </button>
        </div>
        
        {error && (
          <div className="p-2 mb-4 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Comentario <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#7B1429] focus:border-[#7B1429] min-h-[100px]"
              placeholder="Escribe tu revisión aquí..."
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-xs text-slate-600 mb-1">
              Estado del Artículo <span className="text-red-500">*</span>
            </label>
            <div className="w-40">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B1429] focus:border-transparent"
              >
                <option value="4">Aprobado (4)</option>
                <option value="5">Rechazado (5)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#7B1429] rounded-md hover:bg-[#5a0f1f]"
            >
              {submitting ? 'Enviando...' : 'Enviar Revisión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
