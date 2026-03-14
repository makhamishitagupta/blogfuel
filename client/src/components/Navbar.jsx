import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, Bookmark } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import Avatar from './Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    [
      'text-sm font-medium transition-colors',
      isActive
        ? 'text-[var(--color-primary)]'
        : 'text-slate-600 hover:text-[var(--color-primary-hover)]',
    ].join(' ');

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-primary) text-white shadow-sm">
            <span className="text-xs font-semibold">BF</span>
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-slate-900">BlogFuel</span>
            <span className="text-[11px] text-(--color-text-light)">Your daily reading feed</span>
          </div>
        </Link>

        <nav className="ml-4 hidden items-center gap-5 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/search" className={navLinkClass}>
            Explore
          </NavLink>
          <NavLink to="/announcements" className={navLinkClass}>
            Updates
          </NavLink>
        </nav>

        <div className="mx-3 flex-1 max-w-xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 sm:inline-flex"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary text-xs sm:text-sm">
                Get started
              </Link>
            </>
          ) : (
            <>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm shadow-sm hover:bg-slate-50"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                >
                  <Avatar size="sm" name={user?.name} />
                  <span className="hidden text-xs font-medium text-slate-800 sm:inline">
                    {user?.name}
                  </span>
                  <User className="h-3 w-3 text-slate-400" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white py-2 text-sm shadow-lg ring-1 ring-slate-200">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        navigate('/dashboard/user/profile');
                        setIsProfileOpen(false);
                      }}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        navigate('/dashboard/user/favorites');
                        setIsProfileOpen(false);
                      }}
                    >
                      <Bookmark className="h-4 w-4 text-(--color-primary)" />
                      <span>Favorites</span>
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        navigate('/dashboard/user');
                        setIsProfileOpen(false);
                      }}
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                        D
                      </span>
                      <span>Dashboard</span>
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pb-3 pt-2 md:hidden">
          <nav className="flex flex-wrap gap-4">
            <NavLink to="/" end className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/search" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Explore
            </NavLink>
            <NavLink to="/announcements" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
              Updates
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

