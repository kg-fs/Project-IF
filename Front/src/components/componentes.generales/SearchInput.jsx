import { useState } from 'react';

export default function SearchInput({ placeholder = 'Buscar…', className = '' }) {
  const [value, setValue] = useState('');
  const container = `relative ${className || 'w-36'}`;
  return (
    <div className={container}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-300 px-3 py-1.5 pr-8 text-xs outline-none focus:ring-2 focus:ring-[#7B1429] focus:border-[#7B1429]"
      />
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
    </div>
  );
}
