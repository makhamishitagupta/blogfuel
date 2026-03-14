import { useState, useEffect } from 'react';
import { Shield, UserPlus, Users as UsersIcon } from 'lucide-react';
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
      <header>
        <h1 className="text-sm font-semibold text-slate-900">Manage users</h1>
        <p className="text-xs text-(--color-text-light)">
          Invite and promote admins, and view all registered users.
        </p>
      </header>

      <section className="card bg-white">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-primary) text-white shadow-sm">
            <UserPlus className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">Create admin</p>
            <p className="text-[11px] text-(--color-text-light)">
              Assign administrative privileges to a new account.
            </p>
          </div>
        </div>
        <form onSubmit={handleCreateAdmin} className="space-y-3 text-xs">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-(--color-primary) focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-(--color-primary) focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-(--color-primary) focus:bg-white focus:outline-none"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-(--color-primary) px-4 py-1.5 text-xs font-semibold text-white hover:bg-(--color-primary-hover) disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Create admin'}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
           <UsersIcon className="h-4 w-4 text-slate-400" />
           <h2 className="text-sm font-semibold text-slate-900">All Users</h2>
        </div>
        
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 flex items-center gap-2">
                       <Avatar size="xs" name={u.name} />
                       <span className="font-medium text-slate-900">{u.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                       <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                         u.role === 'admin' 
                           ? 'bg-amber-50 text-amber-700 ring-amber-100' 
                           : 'bg-slate-50 text-slate-600 ring-slate-100'
                       }`}>
                         {u.role}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
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
