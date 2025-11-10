import { useState } from 'react';

export default function AddUserForm({ onClose }) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [userPart, setUserPart] = useState('');
  const [role, setRole] = useState(2); // Investigador por defecto
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const apiBase = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMsg('');
    setError('');

    const username = String(userPart || '').replace(/@.*$/,'').replace(/\.com/gi,'').replace(/\s+/g,'');
    if (!username) { setError('Ingresa el usuario de correo'); return; }
    if (!first.trim() || !last.trim()) { setError('Nombre y apellido son obligatorios'); return; }
    if (!password || password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    if (password !== password2) { setError('Las contraseñas no coinciden'); return; }

    try {
      setLoading(true);
      const body = {
        First_name_user: first.trim(),
        Last_name_user: last.trim(),
        Email: `${username}@NovaForum.com`,
        Password_user: password,
        Num_rol: Number(role),
        Num_cat_state: 1,
      };
      const resp = await fetch(`${apiBase}/users/inserUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || data?.success === false) {
        setError(data?.message || 'No se pudo crear el usuario');
        return;
      }
      setMsg('Usuario creado con éxito. Volviendo a la tabla…');
      setTimeout(() => { onClose && onClose(); }, 2000);
    } catch (e) {
      setError('Error de red al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] px-4 md:px-6 mt-6 flex items-start md:items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Agregar usuario</h2>
          <button onClick={onClose} type="button" className="text-xs rounded-full border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50">Cerrar</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input value={first} onChange={(e)=>setFirst(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#7B1429]" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Apellido</label>
            <input value={last} onChange={(e)=>setLast(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#7B1429]" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Correo</label>
            <div className="flex items-stretch rounded-md border border-slate-300 overflow-hidden">
              <input value={userPart} onChange={(e)=>setUserPart(e.target.value.replace(/@.*$/,'').replace(/\.com/gi,'').replace(/\s+/g,''))} placeholder="usuario" className="flex-1 px-3 py-2 outline-none focus:ring-2 focus:ring-[#7B1429]" required />
              <span className="px-3 py-2 bg-slate-50 text-slate-700 whitespace-nowrap select-none">@NovaForum.com</span>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" minLength={6} className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#7B1429]" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirmar contraseña</label>
            <input value={password2} onChange={(e)=>setPassword2(e.target.value)} type="password" minLength={6} className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#7B1429]" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Rol</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#7B1429]" required>
              <option value={1}>Administrador</option>
              <option value={2}>Investigador</option>
              <option value={3}>Revisor</option>
            </select>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {msg && <div className="text-sm text-green-600">{msg}</div>}
          <div>
            <button type="submit" disabled={loading} className="inline-flex items-center rounded-full bg-[#7B1429] px-5 py-2 text-xs font-semibold text-white hover:scale-105 disabled:opacity-60">Crear usuario</button>
          </div>
        </form>
      </div>
    </div>
  );
}
