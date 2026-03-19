import { Heart } from 'lucide-react';

const LikeButton = ({ count = 0, liked = false, onToggle, disabled = false }) => {
  const handleClick = () => {
    if (disabled || !onToggle) return;
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !onToggle}
      className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        background: liked ? 'rgba(225,29,72,0.1)' : 'transparent',
        color: liked ? '#e11d48' : 'var(--color-text-muted)',
        border: liked ? '1px solid rgba(225,29,72,0.2)' : '1px solid var(--color-border)',
      }}
      onMouseEnter={e => {
        if (!disabled && onToggle) {
          e.currentTarget.style.background = liked ? 'rgba(225,29,72,0.15)' : 'var(--color-surface)';
          e.currentTarget.style.color = liked ? '#e11d48' : 'var(--color-text)';
        }
      }}
      onMouseLeave={e => {
        if (!disabled && onToggle) {
          e.currentTarget.style.background = liked ? 'rgba(225,29,72,0.1)' : 'transparent';
          e.currentTarget.style.color = liked ? '#e11d48' : 'var(--color-text-muted)';
        }
      }}
    >
      <Heart 
        className="h-3.5 w-3.5 transition-transform group-hover:scale-110" 
        style={{ 
          fill: liked ? '#e11d48' : 'transparent',
          color: liked ? '#e11d48' : 'inherit'
        }} 
      />
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;
