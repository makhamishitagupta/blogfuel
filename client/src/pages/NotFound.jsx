import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
        404
      </div>
      <h1 className="mb-2 text-xl font-semibold text-slate-900">Page not found</h1>
      <p className="mb-4 max-w-md text-xs text-[var(--color-text-light)]">
        The page you’re looking for doesn’t exist or may have moved. Try going back to your reading
        feed.
      </p>
      <Link to="/" className="btn-primary text-xs">
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;

