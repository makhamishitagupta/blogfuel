import { useEffect, useState } from 'react';
import { Trash2, MessageCircle } from 'lucide-react';
import { getAllCommentsAdmin, deleteComment } from '../../services/commentService.js';
import Loader from '../../components/Loader.jsx';

const ModerateComments = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;
    const loadComments = async () => {
      setLoading(true);
      setError('');
      try {
        const comments = await getAllCommentsAdmin();
        if (!active) return;
        
        // Map backend response to current UI rows format
        const formatted = comments.map(c => ({
          blogId: c.blog?._id || c.blog?.id,
          blogTitle: c.blog?.title || 'Unknown Blog',
          blogActive: c.blog?.isActive !== false,
          comment: c
        }));
        
        setRows(formatted);
      } catch (err) {
        if (!active) return;
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load comments.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadComments();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (blogId, commentId) => {
    if (!window.confirm('Are you sure you want to remove this comment?')) return;
    setDeletingId(commentId);
    try {
      await deleteComment(blogId, commentId);
      setRows((prev) => prev.filter((r) => r.comment._id !== commentId));
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

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
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Moderate Comments</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Review and remove comments that violate community guidelines.
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
        <div
          className="overflow-x-auto rounded-2xl shadow-sm"
          style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
        >
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Comment</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>User</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Article</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Date</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ blogId, blogTitle, blogActive, comment }) => {
                const date = new Date(comment.createdAt);
                return (
                  <tr
                    key={comment._id}
                    className="transition-colors duration-150"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td className="max-w-[280px] px-5 py-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                      <p className="line-clamp-2 leading-relaxed">{comment.text}</p>
                    </td>
                    <td className="px-5 py-4 font-medium" style={{ color: 'var(--color-text-muted)' }}>{comment.user?.name}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="line-clamp-1 font-medium" style={{ color: 'var(--color-text)' }}>{blogTitle}</span>
                        <span
                          className="w-fit rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            background: blogActive ? 'rgba(16,185,129,0.1)' : 'var(--color-surface)',
                            color: blogActive ? '#10b981' : 'var(--color-text-muted)',
                          }}
                        >
                          {blogActive ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      {date.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(blogId, comment._id)}
                        disabled={deletingId === comment._id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 disabled:opacity-50"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                        title="Delete Comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ModerateComments;
