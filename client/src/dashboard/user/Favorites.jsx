import { useEffect, useState } from 'react';
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
    <div className="space-y-4">
      <header>
        <h1 className="text-sm font-semibold text-slate-900">Favorites</h1>
        <p className="text-xs text-[var(--color-text-light)]">
          Stories you have bookmarked for later.
        </p>
      </header>

      {loading && <Loader />}
      {error && !loading && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFavorites.map((blog) => (
            <BlogCard key={blog._id || blog.id} blog={blog} />
          ))}
        </div>
      )}

      {!loading && filteredFavorites.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-xs text-slate-500">You haven't saved any stories yet.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;

