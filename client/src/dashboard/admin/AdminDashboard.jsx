import { useEffect, useState } from 'react';
import { FileText, Users, MessageCircle, Heart, Megaphone } from 'lucide-react';
import { getAnnouncements } from '../../services/announcementService.js';
import * as authService from '../../services/authService.js';
import Loader from '../../components/Loader.jsx';
import BlogCard from '../../components/BlogCard.jsx';
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
    { label: 'Live Blogs', value: stats?.totalBlogs || 0, icon: FileText, color: 'text-blue-600' },
    { label: 'Hidden Blogs', value: stats?.inactiveBlogs || 0, icon: Megaphone, color: 'text-slate-400' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-emerald-600' },
    { label: 'Comments', value: stats?.totalComments || 0, icon: MessageCircle, color: 'text-amber-600' },
    { label: 'Total Likes', value: stats?.totalLikes || 0, icon: Heart, color: 'text-rose-600' },
    { label: 'Alerts', value: announcementCount, icon: Megaphone, color: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metricCards.map((card) => (
          <div key={card.label} className="card flex flex-col gap-1 bg-white">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {card.label}
              </p>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recent Publications</h2>
          <Link 
            to="/dashboard/admin/blogs" 
            className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline"
          >
            Manage all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recentBlogs.length === 0 ? (
             <p className="text-xs text-slate-500 py-4">No recent blogs found.</p>
          ) : (
            recentBlogs.map((blog) => (
              <div key={blog._id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-1">
                  <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{blog.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>{blog.author?.name}</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {blog.commentsCount || 0}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {blog.likes?.length || 0}</span>
                  </div>
                  <Link 
                    to={`/blog/${blog._id}`} 
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    View
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
