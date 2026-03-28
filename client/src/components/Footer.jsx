import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Github, Rss } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid rgba(124, 58, 237, 0.2)', background: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {/* About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>MC</div>
              <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>Money<span style={{ color: 'var(--color-primary)' }}>Corner</span></span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
              A curated reading platform for developers, designers, and curious minds. All content is hand-crafted by our editorial team.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[{ icon: Twitter, label: 'Twitter' }, { icon: Github, label: 'GitHub' }, { icon: Rss, label: 'RSS' }].map(({ icon: Icon, label }) => (
                <button key={label} type="button" aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--color-text)' }}>Quick Links</h3>
            <ul className="space-y-2 text-xs">
              {[{ to: '/', label: 'Home Feed' }, { to: '/search', label: 'Explore Articles' }, { to: '/announcements', label: 'Updates' }, { to: '/login', label: 'Sign In' }, { to: '/register', label: 'Create Account' }].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="transition-all duration-200"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Readers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--color-text)' }}>For Readers</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Create a free reader account to save articles, track your history, and follow the topics you love.
            </p>
            <Link to="/search" className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Browse all articles →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded text-white text-[8px] font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>MC</div>
            <p style={{ color: 'var(--color-text-muted)' }}>© {year} MoneyCorner. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            {['Terms', 'Privacy'].map(label => (
              <button key={label} type="button" className="transition-all duration-200"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
