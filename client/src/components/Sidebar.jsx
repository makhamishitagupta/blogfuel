import { NavLink, Link } from 'react-router-dom';

const Sidebar = ({ links, title, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col transition-transform duration-300 md:static md:translate-x-0"
        style={{
          background: 'var(--color-surface-elevated)',
          borderRight: '1px solid var(--color-border)',
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* Logo + brand */}
        <div
          className="flex items-center justify-between px-4 py-5"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-[11px] font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', boxShadow: '0 0 18px rgba(124,58,237,0.4)' }}
            >
              MC
            </div>
            <div>
              <p className="text-sm font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
                Money<span style={{ color: 'var(--color-primary)' }}>Corner</span>
              </p>
              <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                {title || 'Dashboard'}
              </p>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {links.map(({ to, icon: Icon, label, end, disabled }) => (
            <NavLink
              key={to}
              to={disabled ? '#' : to}
              end={end}
              onClick={disabled ? undefined : onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                  disabled
                    ? 'cursor-not-allowed opacity-40'
                    : isActive
                    ? 'text-white shadow-md'
                    : 'hover:bg-[rgba(124,58,237,0.08)]',
                ].join(' ')
              }
              style={({ isActive }) =>
                !disabled && isActive
                  ? { background: 'linear-gradient(135deg, #7c3aed, #9333ea)', color: '#fff' }
                  : { color: 'var(--color-text-muted)' }
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="h-4 w-4 flex-shrink-0 transition-colors duration-200"
                    style={{ color: !disabled && isActive ? '#fff' : undefined }}
                  />
                  <span>{label}</span>
                  {isActive && !disabled && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer link */}
        <div className="p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            ← Back to MoneyCorner
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
