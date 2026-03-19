import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from '../../components/CommentItem.jsx';
import { getMyComments } from '../../services/commentService.js';
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
      <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
        Log in to see your comment history.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
        >
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>My Comments</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            A history of what you’ve shared across stories.
          </p>
        </div>
      </header>

      {loading && <Loader />}
      {error && !loading && (
        <p className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </p>
      )}

      {!loading && (
        <div className="space-y-4">
          {rows.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center shadow-sm"
              style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}
            >
              <MessageCircle className="mx-auto mb-3 h-8 w-8 opacity-40" style={{ color: 'var(--color-primary)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                You have not added any comments yet.
              </p>
            </div>
          ) : (
            rows.map((row) => (
              <div
                key={row._id}
                className="space-y-2 rounded-2xl p-5 shadow-sm transition-colors duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>On</span>
                  <span className="text-[11px] font-bold" style={{ color: 'var(--color-primary)' }}>
                    {row.blog?.title || 'Unknown Story'}
                  </span>
                </div>
                <div className="pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <CommentItem comment={row} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyComments;
