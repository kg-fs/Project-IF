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

  // Función para obtener el color según el rol
  const getRoleColor = (role) => {
    switch((role || '').toLowerCase()) {
      case 'administrador':
        return 'bg-blue-100 text-blue-800';
      case 'investigador':
        return 'bg-green-100 text-green-800';
      case 'revisor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener la inicial del nombre
  const getInitials = (firstName = '', lastName = '') => {
    const first = firstName.charAt(0) || '';
    const last = lastName.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <div className="mt-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-800">Gestión de Usuarios</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('show-admin-add-user'))}
            className="inline-flex items-center rounded-full bg-[#7B1429] px-4 py-1.5 text-xs font-medium text-white hover:scale-105 transition-all h-8"
          >
            <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar usuario
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7B1429]"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        rows.length ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rows.map((user) => {
              const firstName = user.Firs_name_user || user.First_name_user || user.first_name_user || '';
              const lastName = user.Last_name_user || user.last_name_user || '';
              const role = user.Rol || user.Name_rol || 'Sin rol';
              const email = user.Email || 'Sin correo';
              
              return (
                <div key={user.Num_user} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-[#7B1429] flex items-center justify-center text-white font-medium text-lg">
                        {getInitials(firstName, lastName)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {firstName} {lastName}
                      </h3>
                      <p className="text-xs text-slate-500 truncate" title={email}>
                        {email}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                          {role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      ID: {user.Num_user}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No hay usuarios</h3>
            <p className="mt-1 text-sm text-slate-500">Empieza agregando un nuevo usuario.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('show-admin-add-user'))}
                className="inline-flex items-center rounded-md bg-[#7B1429] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5a0f20] focus:outline-none focus:ring-2 focus:ring-[#7B1429] focus:ring-offset-2"
              >
                <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo usuario
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
