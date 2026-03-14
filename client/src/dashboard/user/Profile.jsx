import { useState, useEffect } from 'react';
import Avatar from '../../components/Avatar.jsx';
import Loader from '../../components/Loader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { updateCurrentUserProfile } from '../../services/userService.js';
import * as authService from '../../services/authService.js';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [activity, setActivity] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoadingActivity(true);
        const data = await authService.getUserActivity();
        setActivity(data.activity);
      } catch (err) {
        console.error('Failed to fetch activity:', err);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchActivity();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateCurrentUserProfile({ name });
      setUser(updated);
      setSuccess('Profile updated.');
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Failed to update profile.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <p className="text-sm text-[var(--color-text-light)]">
        You need to be logged in to view your profile.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
      <section className="card flex items-center gap-4 bg-white">
        <Avatar size="lg" name={user.name} />
        <div className="space-y-1 w-full">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
          />
          <p className="text-sm text-[var(--color-text-light)]">{user.email}</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </section>

      <section className="card bg-white">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Activity
        </h3>
        {loadingActivity ? (
          <Loader />
        ) : activity ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs text-slate-600">Blogs read</span>
              <span className="text-sm font-bold text-slate-900">{activity.blogsRead}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs text-slate-600">Blogs saved</span>
              <span className="text-sm font-bold text-slate-900">{activity.blogsSaved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Comments made</span>
              <span className="text-sm font-bold text-slate-900">{activity.commentsMade}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[var(--color-text-light)]">
            No activity data available.
          </p>
        )}
      </section>
    </div>
  );
};

export default Profile;

