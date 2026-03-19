import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { getFavoriteBlogs } from '../../services/blogService.js';
import Loader from '../../components/Loader.jsx';
import BlogCard from '../../components/BlogCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getFavoriteBlogs();
        if (!active) return;
        setFavorites(data.blogs || []);
      } catch (err) {
        if (!active) return;
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load favorites.';
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

  // Filter local state based on global favorites to ensure cards disappear when unfavorited
  const filteredFavorites = favorites.filter(blog => 
    user?.favorites?.includes(blog._id || blog.id)
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
        >
          <Bookmark className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Favorites</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Stories you have bookmarked to read later.
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFavorites.map((blog) => (
            <BlogCard key={blog._id || blog.id} blog={blog} />
          ))}
        </div>
      )}

      {!loading && filteredFavorites.length === 0 && (
        <div
          className="rounded-2xl p-10 text-center shadow-sm"
          style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}
        >
          <Bookmark className="mx-auto mb-3 h-8 w-8 opacity-40" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
            You haven't saved any stories yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
