import { NavLink, Link } from 'react-router-dom';

const Sidebar = ({ links, title }) => {
  const commonClasses =
    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors';

  return (
    <aside className="w-64 border-r border-slate-200 bg-white/95 px-4 py-6 backdrop-blur-md">
      <Link to="/" className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-primary) text-white shadow-sm">
          <span className="text-xs font-semibold">BF</span>
        </div>
        <div className="hidden flex-col leading-tight sm:flex">
          <span className="text-sm font-semibold text-slate-900">BlogFuel</span>
          <span className="text-[11px] text-(--color-text-light)">
            {title || 'Dashboard'}
          </span>
        </div>
      </Link>
      <nav className="space-y-1">
        {links.map(({ to, icon: Icon, label, end, disabled }) => (
          <NavLink
            key={to}
            to={disabled ? '#' : to}
            end={end}
            className={({ isActive }) =>
              [
                commonClasses,
                disabled
                  ? 'cursor-not-allowed text-slate-300'
                  : isActive
                    ? 'bg-(--color-primary) text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

