import { Bookmark } from 'lucide-react';

const FavoriteButton = ({ saved = false, compact = false, onToggle, disabled = false }) => {
  const handleClick = () => {
    if (disabled || !onToggle) return;
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !onToggle}
      className={`group inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      }`}
      style={{
        background: saved ? 'var(--color-primary)' : 'transparent',
        color: saved ? '#ffffff' : 'var(--color-text-muted)',
        border: saved ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
      }}
      onMouseEnter={e => {
        if (!disabled && onToggle) {
          e.currentTarget.style.background = saved ? 'var(--color-primary-hover)' : 'var(--color-surface)';
          e.currentTarget.style.color = saved ? '#ffffff' : 'var(--color-text)';
        }
      }}
      onMouseLeave={e => {
        if (!disabled && onToggle) {
          e.currentTarget.style.background = saved ? 'var(--color-primary)' : 'transparent';
          e.currentTarget.style.color = saved ? '#ffffff' : 'var(--color-text-muted)';
        }
      }}
    >
      <Bookmark
        className="h-3.5 w-3.5 transition-transform group-hover:scale-110"
        style={{
          fill: saved ? '#ffffff' : 'transparent',
          color: saved ? '#ffffff' : 'inherit'
        }}
      />
      {!compact && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
};

export default FavoriteButton;
