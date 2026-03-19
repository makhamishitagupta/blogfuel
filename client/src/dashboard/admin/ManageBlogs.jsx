import { useEffect, useState } from 'react';
import { Edit2, Trash2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllBlogsAdmin, deleteBlog } from '../../services/blogService.js';
import Loader from '../../components/Loader.jsx';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAllBlogsAdmin();
        if (!active) return;
        setBlogs(data.blogs || []);
      } catch (err) {
        if (!active) return;
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load blogs.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    setDeletingId(id);
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id));
    } catch {
      // ignore for now
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
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Manage Articles</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Edit, review, or remove published stories.
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
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Title</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Author</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Date</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Likes</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr
                  key={blog._id || blog.id}
                  className="transition-colors duration-150"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td className="max-w-[200px] px-5 py-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                    <p className="truncate">{blog.title}</p>
                  </td>
                  <td className="px-5 py-4 font-medium" style={{ color: 'var(--color-text-muted)' }}>{blog.author?.name}</td>
                  <td className="px-5 py-4 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        background: blog.isActive ? 'rgba(16,185,129,0.1)' : 'var(--color-surface)',
                        color: blog.isActive ? '#10b981' : 'var(--color-text-muted)',
                      }}
                    >
                      {blog.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                    {Array.isArray(blog.likes) ? blog.likes.length : 0}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/dashboard/admin/blogs/${blog._id || blog.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(blog._id || blog.id)}
                        disabled={deletingId === (blog._id || blog.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 disabled:opacity-50"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
