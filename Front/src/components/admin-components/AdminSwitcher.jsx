import { useEffect, useState } from 'react';
import ShowArticles from '../componentes.generales/ShowArticles.jsx';
import UsersTable from './UsersTable.jsx';
import AddUserForm from './AddUserForm.jsx';
import ReviewsTable from './ReviewsTable.jsx';
import PublishedArticles from './PublishedArticles.jsx';

export default function AdminSwitcher() {
  const [mode, setMode] = useState('published'); // Default to published articles

  useEffect(() => {
    console.log('AdminSwitcher montado');
    
    const handleUsers = () => setMode('users');
    const handleAddUser = () => setMode('add');
    const handleAllArticles = () => setMode('all');
    const handleReviews = () => setMode('reviews');
    const handlePublishArticle = () => setMode('publish');
    const handlePublished = () => setMode('published');
    
    // Add event listeners
    window.addEventListener('show-admin-users', handleUsers);
    window.addEventListener('show-admin-add-user', handleAddUser);
    window.addEventListener('show-all-articles', handleAllArticles);
    window.addEventListener('show-review-articles', handleReviews);
    window.addEventListener('show-publish-article', handlePublishArticle);
    window.addEventListener('show-published-articles', handlePublished);
    
    // Show published articles by default
    window.dispatchEvent(new Event('show-published-articles'));
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('show-admin-users', handleUsers);
      window.removeEventListener('show-admin-add-user', handleAddUser);
      window.removeEventListener('show-all-articles', handleAllArticles);
      window.removeEventListener('show-review-articles', handleReviews);
      window.removeEventListener('show-publish-article', handlePublishArticle);
      window.removeEventListener('show-published-articles', handlePublished);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {mode === 'all' && <ShowArticles />}
      {mode === 'users' && <UsersTable onClose={() => window.dispatchEvent(new Event('show-all-articles'))} />}
      {mode === 'add' && <AddUserForm onClose={() => window.dispatchEvent(new Event('show-admin-users'))} />}
      {mode === 'reviews' && <ReviewsTable onClose={() => window.dispatchEvent(new Event('show-all-articles'))} />}
      {mode === 'publish' && <PublishedArticles onClose={() => window.dispatchEvent(new Event('show-all-articles'))} />}
      {mode === 'published' && <ShowArticles />}
    </div>
  );
}
