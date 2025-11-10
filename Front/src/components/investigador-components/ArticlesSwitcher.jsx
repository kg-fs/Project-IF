import { useEffect, useState } from 'react';
import ShowArticles from '../componentes.generales/ShowArticles.jsx';
import MyArticlesByAuthor from './MyArticlesByAuthor.jsx';

export default function ArticlesSwitcher() {
  const [mode, setMode] = useState('all'); // 'all' | 'mine'

  useEffect(() => {
    const toMine = () => setMode('mine');
    const toAll = () => setMode('all');
    window.addEventListener('show-my-articles', toMine);
    window.addEventListener('show-all-articles', toAll);
    return () => {
      window.removeEventListener('show-my-articles', toMine);
      window.removeEventListener('show-all-articles', toAll);
    };
  }, []);

  if (mode === 'mine') {
    return <MyArticlesByAuthor onClose={() => setMode('all')} />;
  }
  return <ShowArticles />;
}
