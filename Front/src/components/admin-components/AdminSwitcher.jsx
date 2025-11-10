import { useEffect, useState } from 'react';
import ShowArticles from '../componentes.generales/ShowArticles.jsx';
import UsersTable from './UsersTable.jsx';
import AddUserForm from './AddUserForm.jsx';

export default function AdminSwitcher() {
  const [mode, setMode] = useState('all'); // 'all' | 'users' | 'add'

  useEffect(() => {
    const toUsers = () => setMode('users');
    const toAdd = () => setMode('add');
    const toAll = () => setMode('all');
    window.addEventListener('show-admin-users', toUsers);
    window.addEventListener('show-admin-add-user', toAdd);
    window.addEventListener('show-all-articles', toAll);
    return () => {
      window.removeEventListener('show-admin-users', toUsers);
      window.removeEventListener('show-admin-add-user', toAdd);
      window.removeEventListener('show-all-articles', toAll);
    };
  }, []);

  if (mode === 'users') {
    return <UsersTable onClose={() => setMode('all')} />;
  }
  if (mode === 'add') {
    return <AddUserForm onClose={() => setMode('users')} />;
  }
  return <ShowArticles />;
}
