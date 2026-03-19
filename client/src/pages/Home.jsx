import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Pin, Megaphone, FileText, Calendar } from 'lucide-react';
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
        // Just take max latest 3 announcements for Home. 
        setAnnouncements(announcementsRes?.slice(0, 3) || []);
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
    return () => { active = false; };
  }, [tag]);

  return (
    <div className="space-y-12">

      {/* ── Hero Section ─────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-2xl px-6 py-14 text-white sm:px-10 sm:py-20"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0533 50%, #0a0a0a 100%)',
        }}
      >
        <div
          className="animate-glow-pulse pointer-events-none absolute"
          style={{
            top: '-60px', left: '30%', width: '420px', height: '420px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: '-40px', right: '10%', width: '300px', height: '300px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        <div className="relative z-10 space-y-6 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(168,85,247,0.9)' }}>
            Welcome to BlogFuel
          </p>
          <h1 className="text-balance font-black leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            Discover Stories That{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              Inspire &amp; Educate.
            </span>
          </h1>
          <p className="max-w-md text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Hand-picked articles on technology, design, and ideas — published by our team of expert writers.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <NavLink to="/search" className="btn-primary px-6 py-2.5 text-sm">
              Start Reading
              <ArrowRight className="ml-1 h-4 w-4" />
            </NavLink>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200"
              style={{ border: '1.5px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.07)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Announcements ────────────────────────────────── */}
      {announcements.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
              <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>Updates</h2>
            </div>
            <Link
              to="/announcements"
              className="text-xs font-semibold transition-colors duration-200"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => (
              <article
                key={a._id}
                className="relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: 'var(--color-surface-elevated)',
                  border: a.important ? '1px solid rgba(124,58,237,0.3)' : '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-1"
                  style={{ background: a.important ? 'linear-gradient(to bottom, #7c3aed, #a855f7)' : 'transparent' }}
                />

                {a.important && (
                  <div
                    className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    <Pin className="h-2.5 w-2.5" />
                    Important
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(a.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-bold leading-tight" style={{ color: 'var(--color-text)' }}>{a.title}</h3>
                    <p className="line-clamp-3 text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>
                      {a.content}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {loading && <Loader />}

      {error && !loading && (
        <p className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </p>
      )}

      {!loading && blogs.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
            No blogs found {tag ? `for tag "#${tag}"` : ''}.
          </p>
          {tag && (
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-xs font-bold transition-colors duration-200"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
            >
              Show all stories
            </button>
          )}
        </div>
      )}

      {!loading && blogs.length > 0 && (
        <>
          {tag && (
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Showing stories for:
                </span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background: 'rgba(124,58,237,0.12)',
                    color: 'var(--color-primary-soft)',
                    border: '1px solid rgba(124,58,237,0.25)',
                  }}
                >
                  #{tag}
                </span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
              >
                <ArrowLeft className="h-3 w-3" />
                Clear filter
              </button>
            </div>
          )}

          {/* ── Recent Articles ────────────────────────────────── */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Recent Articles
                </h2>
              </div>
              <Link
                to="/search"
                className="text-xs font-semibold transition-colors duration-200 hidden sm:block"
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
              >
                View all articles →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.slice(0, 3).map((blog) => (
                <BlogCard key={blog._id || blog.id} blog={blog} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/search"
                className="btn-primary inline-flex px-8 py-3 text-sm font-semibold"
              >
                Explore More Articles
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
