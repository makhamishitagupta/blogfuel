import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
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
    <div className="space-y-4">
      <header>
        <h1 className="text-sm font-semibold text-slate-900">Moderate comments</h1>
        <p className="text-xs text-(--color-text-light)">
          Review and remove comments that violate community guidelines.
        </p>
      </header>

      {loading && <Loader />}
      {error && !loading && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!loading && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-2">Comment</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Blog</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ blogId, blogTitle, blogActive, comment }) => {
                const date = new Date(comment.createdAt);
                return (
                  <tr key={comment._id} className="hover:bg-slate-50/70">
                    <td className="max-w-xs px-4 py-2 text-slate-800">
                      <p className="line-clamp-2">{comment.text}</p>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{comment.user?.name}</td>
                    <td className="px-4 py-2 text-slate-600">
                      <div className="flex flex-col gap-0.5">
                        <span className="line-clamp-1">{blogTitle}</span>
                        <span className={`w-fit rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                          blogActive 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {blogActive ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-slate-500">
                      {date.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(blogId, comment._id)}
                        disabled={deletingId === comment._id}
                        className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[11px] text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        <Trash2 className="h-3 w-3" />
                        {deletingId === comment._id ? 'Deleting' : 'Delete'}
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

