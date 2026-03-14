import { useEffect, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
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
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Manage blogs</h1>
          <p className="text-xs text-(--color-text-light)">
            Edit, review, or remove published stories.
          </p>
        </div>
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
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Likes</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((blog) => (
                <tr key={blog._id || blog.id} className="hover:bg-slate-50/70">
                  <td className="max-w-xs px-4 py-2 text-slate-900">
                    <p className="line-clamp-1">{blog.title}</p>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{blog.author?.name}</td>
                  <td className="px-4 py-2 text-slate-500">
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : ''}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      blog.isActive 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {blog.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-slate-700">
                    {Array.isArray(blog.likes) ? blog.likes.length : 0}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/dashboard/admin/blogs/${blog._id || blog.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-200"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(blog._id || blog.id)}
                        disabled={deletingId === (blog._id || blog.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[11px] text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        <Trash2 className="h-3 w-3" />
                        {deletingId === (blog._id || blog.id) ? 'Deleting' : 'Delete'}
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

