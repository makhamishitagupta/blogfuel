import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { getAllBlogsAdmin } from '../../services/blogService.js';
import Loader from '../../components/Loader.jsx';

const AdminAnalytics = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAllBlogsAdmin();
        if (!active) return;
        setBlogs(data.blogs || []);
      } catch (err) {
        if (!active) return;
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load analytics.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const byAuthor = blogs.reduce((acc, blog) => {
    const name = blog.author?.name || 'Unknown';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const maxCount = Object.values(byAuthor).length
    ? Math.max(...Object.values(byAuthor))
    : 0;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
        >
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            A lightweight view of how content is distributed.
          </p>
        </div>
      </header>

      {loading && <Loader />}
      {error && !loading && (
        <p className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </p>
      )}

      {!loading && (
        <section
          className="rounded-2xl p-6 shadow-sm"
          style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="mb-5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
            Posts by author
          </h2>
          <div className="space-y-4">
            {Object.entries(byAuthor).map(([author, count]) => (
              <div key={author} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{author}</span>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{count} posts</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--color-surface)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${maxCount ? (count / maxCount) * 100 : 0}%`,
                      background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminAnalytics;
