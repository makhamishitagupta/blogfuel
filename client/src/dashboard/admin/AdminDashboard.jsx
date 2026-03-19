import { useEffect, useState } from 'react';
import { FileText, Users, MessageCircle, Heart, Megaphone, TrendingUp } from 'lucide-react';
import { getAnnouncements } from '../../services/announcementService.js';
import * as authService from '../../services/authService.js';
import Loader from '../../components/Loader.jsx';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, annData] = await Promise.all([
          authService.getAdminStats(),
          getAnnouncements()
        ]);
        setStats(statsData.stats);
        setRecentBlogs(statsData.recentBlogs || []);
        setAnnouncementCount(annData?.length || 0);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  const metricCards = [
    { label: 'Live Blogs', value: stats?.totalBlogs || 0, icon: FileText, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Hidden Blogs', value: stats?.inactiveBlogs || 0, icon: TrendingUp, gradient: 'from-slate-500 to-slate-600' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Comments', value: stats?.totalComments || 0, icon: MessageCircle, gradient: 'from-amber-500 to-amber-600' },
    { label: 'Total Likes', value: stats?.totalLikes || 0, icon: Heart, gradient: 'from-rose-500 to-rose-600' },
    { label: 'Alerts', value: announcementCount, icon: Megaphone, gradient: 'from-purple-500 to-purple-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* Purple gradient top border */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
            />
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {card.label}
                </p>
                <p
                  className="text-2xl font-black"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {card.value}
                </p>
              </div>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.12)' }}
              >
                <card.icon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Publications */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Recent Publications
            </h2>
          </div>
          <Link
            to="/dashboard/admin/blogs"
            className="text-[11px] font-semibold transition-colors duration-200"
            style={{ color: 'var(--color-primary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
          >
            Manage all →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentBlogs.length === 0 ? (
            <p className="text-xs py-4" style={{ color: 'var(--color-text-muted)' }}>
              No recent blogs found.
            </p>
          ) : (
            recentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="flex flex-col gap-3 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div>
                  <h3 className="line-clamp-1 text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                    {blog.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                    <span>{blog.author?.name}</span>
                    <span>·</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div
                  className="flex items-center justify-between pt-2 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                >
                  <div className="flex gap-3" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> {blog.commentsCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" /> {blog.likes?.length || 0}
                    </span>
                  </div>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="transition-colors duration-200"
                    style={{ color: 'var(--color-primary)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
