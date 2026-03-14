import { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Edit3, AlertCircle, CheckCircle2 } from 'lucide-react';
import Loader from '../../components/Loader.jsx';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/announcementService.js';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateAnnouncement(editingId, { title, content, important });
        setSuccess('Announcement updated successfully.');
      } else {
        await createAnnouncement({ title, content, important });
        setSuccess('Announcement created successfully.');
      }
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ann) => {
    setEditingId(ann._id);
    setTitle(ann.title);
    setContent(ann.content);
    setImportant(ann.important);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      setSuccess('Announcement deleted.');
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to delete announcement.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImportant(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-sm font-semibold text-slate-900">Manage Announcements</h1>
        <p className="text-xs text-[var(--color-text-light)]">
          Keep your community informed with latest updates and news.
        </p>
      </header>

      <section className="card bg-white shadow-sm ring-1 ring-slate-200 p-6 rounded-2xl">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-sm">
            {editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">{editingId ? 'Edit' : 'Create'} Announcement</p>
            <p className="text-[11px] text-[var(--color-text-light)]">
              {editingId ? 'Update existing announcement details.' : 'Publish a new update to all users.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to announce?"
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none resize-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="important"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <label htmlFor="important" className="text-xs font-medium text-slate-700 select-none">
                Mark as important
              </label>
            </div>
          </div>

          {error && <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg"><AlertCircle className="h-3.5 w-3.5" />{error}</div>}
          {success && <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg"><CheckCircle2 className="h-3.5 w-3.5" />{success}</div>}

          <div className="flex justify-end gap-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[var(--color-primary)] px-6 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition shadow-sm"
            >
              {submitting ? 'Saving...' : editingId ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">Announcement History</h2>
        </div>

        {loading ? (
          <Loader />
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
            <p className="text-sm text-[var(--color-text-light)]">No announcements found.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {announcements.map((ann) => (
              <div key={ann._id} className="group relative flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                        ann.important 
                          ? 'bg-rose-50 text-rose-700 ring-rose-100' 
                          : 'bg-slate-50 text-slate-600 ring-slate-100'
                      }`}>
                        {ann.important ? 'Important' : 'Standard'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ann.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                   </div>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(ann)}
                        className="p-1.5 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(ann._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageAnnouncements;
