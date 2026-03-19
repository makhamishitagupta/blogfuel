import { useEffect, useState } from 'react';
import { Bookmark, Clock, Link as LinkIcon } from 'lucide-react';
import BlogCard from '../../components/BlogCard.jsx';
import Loader from '../../components/Loader.jsx';
import { getFavoriteBlogs } from '../../services/blogService.js';
import * as authService from '../../services/authService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    const load = async () => {
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
    load();
    return () => { active = false; };
  }, []);

  const activeFavorites = favorites.filter(blog =>
    user?.favorites?.includes(blog._id || blog.id)
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-black" style={{ color: 'var(--color-text)' }}>
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Here's a summary of your reading activity.
        </p>
      </div>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: 'Articles Read',
            value: history.length,
            icon: Clock,
            description: "Stories you've explored",
            link: '/dashboard/user/history',
            linkLabel: 'View history',
          },
          {
            label: 'Saved',
            value: activeFavorites.length,
            icon: Bookmark,
            description: 'Articles in your reading list',
            link: '/dashboard/user/favorites',
            linkLabel: 'View saved',
          },
        ].map(({ label, value, icon: Icon, description, link, linkLabel }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  {label}
                </p>
                <p className="text-3xl font-black" style={{ color: 'var(--color-primary)' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{description}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ background: 'rgba(124,58,237,0.12)' }}>
                <Icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
            <Link
              to={link}
              className="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors duration-200"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
            >
              {linkLabel} →
            </Link>
          </div>
        ))}
      </section>

      {/* Recently Read */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Continue Reading</h2>
          </div>
          <Link
            to="/dashboard/user/history"
            className="text-[11px] font-semibold transition-colors duration-200"
            style={{ color: 'var(--color-primary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
          >
            View all →
          </Link>
        </div>
        {history.length === 0 ? (
          <div
            className="rounded-xl px-5 py-8 text-center"
            style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}
          >
            <Clock className="mx-auto mb-2 h-8 w-8 opacity-25" style={{ color: 'var(--color-text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>You haven't read any articles yet.</p>
            <Link to="/" className="btn-primary mt-4 inline-flex text-xs px-4 py-2">Browse Articles</Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.slice(0, 3).map((blog) => (
              <BlogCard key={`${blog._id || blog.id}-${blog.viewedAt}`} blog={blog} />
            ))}
          </div>
        )}
      </section>

      {/* Saved Articles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Saved Articles</h2>
          </div>
          <Link
            to="/dashboard/user/favorites"
            className="text-[11px] font-semibold transition-colors duration-200"
            style={{ color: 'var(--color-primary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
          >
            View all →
          </Link>
        </div>
        {activeFavorites.length === 0 ? (
          <div
            className="rounded-xl px-5 py-8 text-center"
            style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}
          >
            <Bookmark className="mx-auto mb-2 h-8 w-8 opacity-25" style={{ color: 'var(--color-text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No saved articles yet. Tap the bookmark icon on any article.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
