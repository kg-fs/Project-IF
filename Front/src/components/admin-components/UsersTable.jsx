import { useEffect, useState } from 'react';

export default function UsersTable({ onClose, refreshInterval = 10000 }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const apiBase = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';
    let stopped = false;

    const load = async () => {
      if (stopped) return;
      
      setLoading(true);
      setError('');
      try {
        const resp = await fetch(`${apiBase}/users/GetAllUsersWithRoles`);
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || data?.success === false) {
          setError(data?.message || 'No se pudieron cargar los usuarios');
          setRows([]);
        } else {
          setRows(Array.isArray(data.users) ? data.users : []);
        }
      } catch (e) {
        setError('Error de red al cargar usuarios');
        setRows([]);
      } finally {
        if (!stopped) {
          setLoading(false);
        }
      }
    };

    // Carga inicial
    load();
    
    // Configurar intervalo para actualizaciones periódicas
    const intervalId = setInterval(load, refreshInterval);
    
    // Limpieza
    return () => {
      stopped = true;
      clearInterval(intervalId);
    };
  }, [refreshInterval]);

  return (
    <div className="mt-6 px-4 md:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Usuarios</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('show-admin-add-user'))}
            className="inline-flex items-center rounded-full bg-[#7B1429] px-3 py-1 text-xs font-medium text-white hover:scale-105"
          >
            Agregar usuario
          </button>
          <button
            onClick={onClose}
            className="text-xs rounded-full border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-slate-600">Cargando usuarios…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        rows.length ? (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-[#7B1429] text-white">
                <tr>
                  <th className="px-3 py-2 text-left">Num_user</th>
                  <th className="px-3 py-2 text-left">Nombre</th>
                  <th className="px-3 py-2 text-left">Apellido</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Rol</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.Num_user || i} className="odd:bg-white even:bg-slate-50">
                    <td className="px-3 py-2">{r.Num_user}</td>
                    <td className="px-3 py-2">{r.Firs_name_user || r.First_name_user || r.first_name_user || ''}</td>
                    <td className="px-3 py-2">{r.Last_name_user || r.last_name_user || ''}</td>
                    <td className="px-3 py-2">{r.Email}</td>
                    <td className="px-3 py-2">{r.Rol || r.Name_rol || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-slate-500">No hay usuarios.</div>
        )
      )}
    </div>
  );
}
