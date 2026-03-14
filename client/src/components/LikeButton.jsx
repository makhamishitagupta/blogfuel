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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
        liked
          ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-100'
          : 'text-slate-500 hover:bg-slate-100'
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;

