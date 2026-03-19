import { useState, useEffect } from 'react';
import { User, Activity } from 'lucide-react';
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
      <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
        You need to be logged in to view your profile.
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
          <User className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Your Profile</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Manage your personal settings and view your account activity.
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        {/* Profile Details Edit */}
        <section
          className="rounded-2xl p-6 shadow-sm"
          style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0">
              <Avatar size="lg" name={user.name} />
            </div>
            <div className="w-full space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 outline-none"
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
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Email Address</label>
                <p className="px-4 py-2 text-sm font-medium" style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface)', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                  {user.email}
                </p>
              </div>

              {error && (
                <p className="rounded-lg px-3 py-2 text-xs font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-lg px-3 py-2 text-xs font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {success}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary rounded-full w-full sm:w-auto px-8 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Stats */}
        <section
          className="rounded-2xl p-6 shadow-sm flex flex-col"
          style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
              Account Activity
            </h3>
          </div>

          {loadingActivity ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader />
            </div>
          ) : activity ? (
            <div className="flex-1 space-y-5">
              <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Stories Read</span>
                <span className="text-lg font-black" style={{ color: 'var(--color-text)' }}>{activity.blogsRead}</span>
              </div>
              <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Stories Saved</span>
                <span className="text-lg font-black" style={{ color: 'var(--color-text)' }}>{activity.blogsSaved}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Comments Made</span>
                <span className="text-lg font-black" style={{ color: 'var(--color-text)' }}>{activity.commentsMade}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                No activity data available yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
