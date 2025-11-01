import { useId, useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const [show, setShow] = useState(false);

  const validate = () => {
    const next = { email: '', password: '' };
    if (!email) next.email = 'El correo es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Correo inválido';
    if (!password) next.password = 'La contraseña es obligatoria';
    if (password && password.length < 6) next.password = 'Mínimo 6 caracteres';
    setErrors(next);
    return !next.email && !next.password;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setServerError('');
    setSuccess(false);
    setSubmitting(true);
    try {
      const baseUrl = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';
      const resp = await fetch(`${baseUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ Email: email, Password_user: password })
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg = data?.message || 'Error al iniciar sesión';
        setServerError(msg);
        return;
      }

      // Guarda información útil del usuario
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        const role = Number(data.user.Num_rol);
        const routes = { 1: '/admin', 2: '/investigador', 3: '/revisor', 4: '/cliente' };
        if (role && routes[role]) {
          window.location.href = routes[role];
          return;
        }
      }
      // Si el backend llegara a enviar el token en el body, lo guardamos
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }

      // El JWT httpOnly será establecido por cookie desde el backend si CORS/cookies están correctamente configurados
      setSuccess(true);
    } catch (err) {
      setServerError('No se pudo conectar con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      <div className="space-y-3">
        <div className="w-full">
          <label htmlFor={emailId} className="block text-sm font-medium text-slate-700">Correo electrónico</label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#7B1429] focus:border-[#7B1429] ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="Ejemplo@NovaForum.com"
            required
          />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
        </div>

        <div className="w-full">
          <label htmlFor={passwordId} className="block text-sm font-medium text-slate-700">Contraseña</label>
          <div className="mt-1 relative">
            <input
              id={passwordId}
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-md border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#7B1429] focus:border-[#7B1429] ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="••••••••"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-800"
            >
              {show ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
        </div>
      </div>
      {serverError ? (
        <p className="text-sm text-red-600">{serverError}</p>
      ) : null}
      {success ? (
        <p className="text-sm text-green-600">Inicio de sesión exitoso</p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-[#7B1429] px-4 py-2 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
      >
        {submitting ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  );
}

