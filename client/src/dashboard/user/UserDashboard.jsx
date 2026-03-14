import { useEffect, useState } from 'react';
import { Bookmark, Clock } from 'lucide-react';
import BlogCard from '../../components/BlogCard.jsx';
import Loader from '../../components/Loader.jsx';
import { getFavoriteBlogs } from '../../services/blogService.js';
import * as authService from '../../services/authService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const UserDashboard = () => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [favsData, historyData] = await Promise.all([
          getFavoriteBlogs(),
          authService.getHistory(),
        ]);
        
        if (!active) return;
        
        setFavorites(favsData.blogs || []);
        setHistory(historyData.history || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    loadDashboardData();
    
    return () => {
      active = false;
    };
  }, []);

  // Live filter favorites based on context
  const activeFavorites = favorites.filter(blog => 
    user?.favorites?.includes(blog._id || blog.id)
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Reading history
            </p>
            <Clock className="h-4 w-4 text-slate-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {history.length}
          </p>
          <p className="text-xs text-[var(--color-text-light)]">Stories you've explored</p>
        </div>
        <div className="card flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Saved for later
            </p>
            <Bookmark className="h-4 w-4 text-slate-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {activeFavorites.length}
          </p>
          <p className="text-xs text-[var(--color-text-light)]">Stories in your library</p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recently read</h2>
        </div>
        {history.length === 0 ? (
          <p className="text-xs text-[var(--color-text-light)]">
            Start reading articles to see them appear here.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {history.slice(0, 3).map((blog) => (
              <BlogCard key={`${blog._id || blog.id}-${blog.viewedAt}`} blog={blog} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Saved for later</h2>
        </div>
        {activeFavorites.length === 0 ? (
          <p className="text-xs text-[var(--color-text-light)]">
            Save blogs from the feed or detail pages to see them here.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {activeFavorites.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id || blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
