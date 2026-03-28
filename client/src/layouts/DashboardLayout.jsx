import { Outlet, Link } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, User, Heart, MessageSquare, Clock,
  FileText, Users, MessageCircle, BarChart3, PlusCircle, Megaphone,
  SunMedium, MoonStar,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';

const DashboardLayout = ({ type }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Sync with the global theme set by Navbar
  useEffect(() => {
    const sync = () => {
      const stored = window.localStorage.getItem('mc-theme');
      setTheme(stored === 'light' ? 'light' : 'dark');
    };
    sync();
    // Re-sync whenever localStorage changes (e.g. toggled from main Navbar in same tab)
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    window.localStorage.setItem('mc-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const userLinks = [
    { to: '/dashboard/user', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/dashboard/user/profile', icon: User, label: 'Profile' },
    { to: '/dashboard/user/favorites', icon: Heart, label: 'Saved Articles' },
    { to: '/dashboard/user/comments', icon: MessageSquare, label: 'My Comments' },
    { to: '/dashboard/user/history', icon: Clock, label: 'Reading History' },
  ];

  const adminLinks = [
    { to: '/dashboard/admin', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/dashboard/admin/create', icon: PlusCircle, label: 'New Article' },
    { to: '/dashboard/admin/blogs', icon: FileText, label: 'Manage Articles' },
    { to: '/dashboard/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/dashboard/admin/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/dashboard/admin/comments', icon: MessageCircle, label: 'Comments' },
    { to: '/dashboard/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const links = type === 'admin' ? adminLinks : userLinks;
  const title = type === 'admin' ? 'Admin' : 'My Account';
  const subtitle =
    type === 'admin'
      ? 'Manage content, users, and announcements.'
      : 'Your reading activity and saved content.';

  return (
    <div
      className="flex min-h-screen"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* Sidebar — hidden on mobile unless toggled */}
      <div className={`fixed inset-y-0 left-0 z-30 md:static md:block ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
        <Sidebar
          links={links}
          title={title}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main content area */}
      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6"
          style={{
            background: 'var(--color-surface-elevated)',
            borderBottom: '1px solid var(--color-border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger toggle — always visible on mobile */}
            <button
              type="button"
              aria-label="Toggle sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 md:hidden"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div>
              <h1 className="text-sm font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
                {title}
              </h1>
              <p className="hidden text-[11px] sm:block" style={{ color: 'var(--color-text-muted)' }}>
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>

            {/* Home link */}
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 sm:flex"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              ← MoneyCorner
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
