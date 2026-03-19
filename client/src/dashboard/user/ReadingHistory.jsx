import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import * as authService from '../../services/authService.js';
import Loader from '../../components/Loader.jsx';
import BlogCard from '../../components/BlogCard.jsx';

const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await authService.getHistory();
        setHistory(data.history || []);
      } catch (err) {
        setError('Failed to load reading history.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="py-10 text-center text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
        >
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Reading History</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Stories you’ve opened recently across BlogFuel.
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {history.length === 0 ? (
          <div
            className="col-span-full rounded-2xl p-10 text-center shadow-sm"
            style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}
          >
            <Clock className="mx-auto mb-3 h-8 w-8 opacity-40" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Once you start exploring stories, they will automatically appear here.
            </p>
          </div>
        ) : (
          history.map((blog) => (
            <BlogCard key={`${blog.id || blog._id}-${blog.viewedAt}`} blog={blog} />
          ))
        )}
      </div>
    </div>
  );
};

export default ReadingHistory;
