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
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Analytics</h1>
          <p className="text-xs text-(--color-text-light)">
            A lightweight view of how content is distributed.
          </p>
        </div>
      </header>

      {loading && <Loader />}
      {error && !loading && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!loading && (
        <section className="card bg-white text-xs">
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Posts by author
          </h2>
          <div className="space-y-2">
            {Object.entries(byAuthor).map(([author, count]) => (
              <div key={author} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-800">{author}</span>
                  <span className="text-[11px] text-slate-500">{count} posts</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-400"
                    style={{ width: `${maxCount ? (count / maxCount) * 100 : 0}%` }}
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

