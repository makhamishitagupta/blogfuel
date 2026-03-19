import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Bookmark, SunMedium, MoonStar, X } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import Avatar from './Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const stored = window.localStorage.getItem('bf-theme');
    const initial = stored === 'light' || stored === 'dark' ? stored : 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('bf-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navLinkClass = ({ isActive }) =>
    [
      'text-sm font-medium transition-all duration-200 relative px-1 py-0.5',
      isActive
        ? 'text-[var(--color-primary)]'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]',
    ].join(' ');

  return (
    <header
      className="sticky top-0 z-30 transition-all duration-200"
      style={{
        background: theme === 'dark'
          ? 'rgba(10, 10, 10, 0.85)'
          : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid var(--color-border)`,
        boxShadow: scrolled
          ? theme === 'dark'
            ? '0 4px 24px rgba(0,0,0,0.6)'
            : '0 4px 24px rgba(124,58,237,0.1)'
          : 'none',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2 transition-all duration-200 md:hidden"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-white text-[11px] font-bold tracking-wider flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
            }}
          >
            BF
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span
              className="text-sm font-bold tracking-tight"
              style={{ color: 'var(--color-text)' }}
            >
              Blog
              <span
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Fuel
              </span>
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Your daily reading feed
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="ml-4 hidden items-center gap-5 md:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/search" className={navLinkClass}>Explore</NavLink>
          <NavLink to="/announcements" className={navLinkClass}>Updates</NavLink>
        </nav>

        {/* Search bar */}
        <div className="mx-3 flex-1 max-w-xl">
          <SearchBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="hidden h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 sm:inline-flex"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
          >
            {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </button>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 sm:inline-flex"
                style={{
                  color: 'var(--color-primary)',
                  border: '1.5px solid var(--color-primary)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary text-xs sm:text-sm">
                Get started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm transition-all duration-200"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                onClick={() => setIsProfileOpen((prev) => !prev)}
              >
                <Avatar size="sm" name={user?.name} />
                <span className="hidden text-xs font-medium sm:inline" style={{ color: 'var(--color-text)' }}>
                  {user?.name}
                </span>
                <User className="h-3 w-3" style={{ color: 'var(--color-text-muted)' }} />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-2xl py-2 text-sm z-50"
                  style={{
                    background: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors duration-150 hover:bg-[rgba(124,58,237,0.08)]"
                    style={{ color: 'var(--color-text)' }}
                    onClick={() => { navigate('/dashboard/user/profile'); setIsProfileOpen(false); }}
                  >
                    <User className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    <span>Profile</span>
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors duration-150 hover:bg-[rgba(124,58,237,0.08)]"
                    style={{ color: 'var(--color-text)' }}
                    onClick={() => { navigate('/dashboard/user/favorites'); setIsProfileOpen(false); }}
                  >
                    <Bookmark className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    <span>Favorites</span>
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors duration-150 hover:bg-[rgba(124,58,237,0.08)]"
                    style={{ color: 'var(--color-text)' }}
                    onClick={() => { navigate('/dashboard/user'); setIsProfileOpen(false); }}
                  >
                    <span
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      D
                    </span>
                    <span>Dashboard</span>
                  </button>
                  <div className="my-1 mx-3" style={{ borderTop: '1px solid var(--color-border)' }} />
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-400 transition-colors duration-150 hover:bg-red-500/10"
                    onClick={() => { setIsProfileOpen(false); logout(); }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="border-b px-4 pb-4 pt-2 md:hidden"
          style={{
            background: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
          }}
        >
          <nav className="flex flex-col gap-1">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/search', label: 'Explore' },
              { to: '/announcements', label: 'Updates' },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[var(--color-primary)] bg-[rgba(124,58,237,0.1)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[rgba(124,58,237,0.05)]'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-2 px-1 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
