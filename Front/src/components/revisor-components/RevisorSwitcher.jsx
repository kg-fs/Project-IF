import { useEffect, useState } from 'react';
import ShowArticles from '../componentes.generales/ShowArticles.jsx';
import PendingReviewArticles from './PendingReviewArticles.jsx';
import MyReviews from './MyReviews.jsx';

export default function RevisorSwitcher() {
  const [mode, setMode] = useState('reviewed');

  useEffect(() => {
    const toEvaluate = () => setMode('evaluate');
    const toReviewed = () => setMode('reviewed');
    const toMyReviews = () => setMode('my-reviews');
    
    window.addEventListener('show-revisor-evaluate', toEvaluate);
    window.addEventListener('show-revisor-reviewed', toReviewed);
    window.addEventListener('show-my-reviews', toMyReviews);
    
    return () => {
      window.removeEventListener('show-revisor-evaluate', toEvaluate);
      window.removeEventListener('show-revisor-reviewed', toReviewed);
      window.removeEventListener('show-my-reviews', toMyReviews);
    };
  }, []);

  switch (mode) {
    case 'evaluate':
      return <PendingReviewArticles onClose={() => setMode('reviewed')} />;
    case 'my-reviews':
      return <MyReviews onClose={() => setMode('reviewed')} />;
    case 'reviewed':
    default:
      return <ShowArticles />;
  }
}
