import { useState, useEffect } from 'react';
import { Shield, UserPlus, Users as UsersIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import Avatar from '../../components/Avatar.jsx';
import Loader from '../../components/Loader.jsx';
import { createAdmin, getAdminUsers } from '../../services/authService.js';

const ManageUsers = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    setSubmitting(true);
    try {
      await createAdmin({ name, email, password });
      setSuccess('Admin created successfully.');
      setName('');
      setEmail('');
      setPassword('');
      fetchUsers(); // Refresh list
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Failed to create admin.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
        >
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Manage Users</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Invite and promote admins, and view all registered users.
          </p>
        </div>
      </header>

      {/* Create Admin Form */}
      <section
        className="rounded-2xl p-6 shadow-sm"
        style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.1)' }}
          >
            <UserPlus className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Create Admin</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Assign administrative privileges to a new account.
            </p>
          </div>
        </div>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
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
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@moneycorner.com"
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
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary rounded-full px-6 py-2 text-sm font-semibold shadow-sm transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create Admin'}
            </button>
          </div>
        </form>
      </section>

      {/* Users Table */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
           <UsersIcon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
           <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>All Registered Users</h2>
        </div>
        
        {loading ? (
          <Loader />
        ) : (
          <div
            className="overflow-x-auto rounded-2xl shadow-sm"
            style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
          >
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>User</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Email</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Role</th>
                  <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="transition-colors duration-150"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td className="px-5 py-4 flex items-center gap-3 font-semibold" style={{ color: 'var(--color-text)' }}>
                       <Avatar size="sm" name={u.name} />
                       <span>{u.name}</span>
                    </td>
                    <td className="px-5 py-4 font-medium" style={{ color: 'var(--color-text-muted)' }}>{u.email}</td>
                    <td className="px-5 py-4">
                       <span
                         className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                         style={{
                           background: u.role === 'admin' ? 'rgba(124,58,237,0.1)' : 'var(--color-surface)',
                           color: u.role === 'admin' ? 'var(--color-primary-soft)' : 'var(--color-text-muted)',
                         }}
                       >
                         {u.role}
                       </span>
                    </td>
                    <td className="px-5 py-4 text-right text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageUsers;
