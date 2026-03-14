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
      className={`inline-flex items-center gap-1 rounded-full text-xs font-medium transition ${
        compact ? 'px-1.5 py-0.5' : 'px-2.5 py-1'
      } ${
        saved
          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
          : 'text-slate-500 hover:bg-slate-100'
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <Bookmark
        className={`h-3.5 w-3.5 ${
          saved ? 'fill-amber-500 text-amber-500' : ''
        }`}
      />
      {!compact && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
};

export default FavoriteButton;

