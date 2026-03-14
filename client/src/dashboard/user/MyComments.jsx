import { useEffect, useState } from 'react';
import CommentItem from '../../components/CommentItem.jsx';
import { getMyComments } from '../../services/commentService.js'; // Import getMyComments
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from '../../components/Loader.jsx';

const MyComments = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const comments = await getMyComments();
        if (!active) return;
        setRows(comments);
      } catch (err) {
        if (!active) return;
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load your comments.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return (
      <p className="text-sm text-[var(--color-text-light)]">
        Log in to see your comment history.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-sm font-semibold text-slate-900">My comments</h1>
        <p className="text-xs text-[var(--color-text-light)]">
          A history of what you’ve shared across stories.
        </p>
      </header>

      {loading && <Loader />}
      {error && !loading && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!loading && (
        <div className="space-y-3">
          {rows.length === 0 ? (
            <p className="text-xs text-[var(--color-text-light)]">
              You have not added any comments yet.
            </p>
          ) : (
            rows.map((row) => (
              <div
                key={row._id}
                className="space-y-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
              >
                <p className="text-[11px] font-medium text-slate-500">
                  On <span className="text-slate-800">{row.blog?.title || 'Unknown Story'}</span>
                </p>
                <CommentItem comment={row} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyComments;

