import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import BlogCard from '../components/BlogCard.jsx';
import Loader from '../components/Loader.jsx';
import { getAllBlogs } from '../services/blogService.js';
import { getAnnouncements } from '../services/announcementService.js';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tag = queryParams.get('tag') || '';

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [blogsRes, announcementsRes] = await Promise.all([
          getAllBlogs(tag),
          getAnnouncements(),
        ]);
        if (!active) return;
        setBlogs(blogsRes.blogs || []);
        setAnnouncements(announcementsRes || []);
      } catch (err) {
        if (!active) return;
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load feed.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [tag]);

  const [first, ...rest] = blogs;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 px-6 py-10 text-white shadow-md sm:px-10">
        <div className="max-w-xl space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">Welcome to BlogFuel</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Discover stories, insights, and ideas.
          </h1>
          <p className="text-sm text-white/90 sm:text-base">
            Read and share thoughtful blog posts from a community of developers, designers, and writers.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <NavLink to="/search" className="btn-primary bg-white text-(--color-primary) hover:bg-slate-50">
              <span>Start reading</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </NavLink>
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/15"
            >
              Browse trending topics
            </button>
          </div>
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Announcements</h2>
          </div>
          <div className="space-y-2 text-xs">
            {announcements.map((a) => (
              <article
                key={a._id}
                className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  {a.important ? 'Important' : 'Update'}
                </p>
                <h3 className="text-sm font-medium text-slate-900">{a.title}</h3>
                <p className="mt-1 text-[11px] text-[var(--color-text-light)]">
                  {a.content}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {loading && <Loader />}
      {error && !loading && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && blogs.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm text-slate-500">No blogs found {tag ? `for tag "#${tag}"` : ''}.</p>
          {tag && (
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-xs font-semibold text-[var(--color-primary)] hover:underline"
            >
              Show all stories
            </button>
          )}
        </div>
      )}

      {!loading && blogs.length > 0 && (
        <>
          {tag && (
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Showing stories for:</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-900 ring-1 ring-slate-200">
                  #{tag}
                </span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Featured today</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {first && <BlogCard key={first._id || first.id} blog={first} />}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Latest from BlogFuel</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((blog) => (
                <BlogCard key={blog._id || blog.id} blog={blog} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;

