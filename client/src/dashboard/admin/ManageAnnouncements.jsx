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
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Manage Announcements</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Keep your community informed with latest updates and news.
        </p>
      </header>

      {/* Editor Section */}
      <section
        className="rounded-2xl p-6 shadow-sm"
        style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
          >
            {editingId ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              {editingId ? 'Edit Announcement' : 'Create Context'}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {editingId ? 'Update existing announcement details.' : 'Publish a new update to all users.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
                className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to announce?"
                rows={4}
                className="w-full resize-none rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="important"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="h-4 w-4 rounded accent-[var(--color-primary)] bg-[var(--color-bg)]"
              />
              <label htmlFor="important" className="select-none text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Mark as important
              </label>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle className="h-4 w-4" />{error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle2 className="h-4 w-4" />{success}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200"
                style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-text-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary rounded-full px-6 py-2 text-sm font-semibold shadow-sm transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingId ? 'Update Context' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </section>

      {/* History Section */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>Announcement History</h2>
        </div>

        {loading ? (
          <Loader />
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>No announcements history found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className="group relative flex flex-col gap-3 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: ann.important ? 'var(--color-primary)' : 'rgba(124,58,237,0.1)',
                          color: ann.important ? '#fff' : 'var(--color-primary-soft)',
                        }}
                      >
                        {ann.important ? 'Important' : 'Standard'}
                      </span>
                      <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(ann.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                   </div>

                   {/* Actions visible on hover inside group */}
                   <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(ann)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ann._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{ann.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>
                    {ann.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageAnnouncements;
