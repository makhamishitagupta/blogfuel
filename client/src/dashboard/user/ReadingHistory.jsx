import { useEffect, useState } from 'react';
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
      <div className="py-10 text-center text-sm text-[var(--color-text-light)]">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-sm font-semibold text-slate-900">Reading history</h1>
        <p className="text-xs text-[var(--color-text-light)]">
          Stories you’ve opened recently across BlogFuel.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {history.length === 0 ? (
          <p className="text-xs text-[var(--color-text-light)] col-span-full">
            Once you start opening blogs, they will appear here.
          </p>
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

