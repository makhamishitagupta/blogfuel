import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { register as registerUser } from '../services/authService.js';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await registerUser({ name, email, password });
      setSuccess('Account created. You can now log in.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.status ||
        'Unable to register with these details.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Password strength
  const strengthLevel = !password
    ? 0
    : password.length < 6
    ? 1
    : password.length < 10
    ? 2
    : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl flex"
        style={{ border: '1px solid var(--color-border)' }}
      >
        {/* Left panel — purple gradient */}
        <div
          className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #3b0764 0%, #5b21b6 50%, #7c3aed 100%)' }}
        >
          {/* Decorative circles */}
          <div
            className="pointer-events-none absolute"
            style={{ top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(168,85,247,0.25)', filter: 'blur(30px)' }}
          />
          <div
            className="pointer-events-none absolute"
            style={{ bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(25px)' }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white text-xs font-bold">
                BF
              </div>
              <span className="text-lg font-bold text-white">BlogFuel</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight mb-3">
              Join a community of readers.
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Create a free account to save your favourite articles, track your reading history, and stay up to date with our latest posts.
            </p>
          </div>
          <div className="relative z-10 space-y-3">
            {['Free to join, forever', 'Bookmark & save articles', 'Personalised reading history'].map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-white/80">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div
          className="flex-1 p-8 sm:p-10"
          style={{ background: 'var(--color-surface-elevated)' }}
        >
          <div className="mb-6">
            <div
              className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'rgba(124,58,237,0.12)' }}
            >
              <UserPlus className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>
              Create Account
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Sign up to save articles, track your reading, and join the discussion.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', type: 'text', value: name, setter: setName, placeholder: 'Jane Doe' },
              { label: 'Email', type: 'email', value: email, setter: setEmail, placeholder: 'jane@example.com' },
              { label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: '••••••••' },
            ].map(({ label, type, value, setter, placeholder }) => (
              <div key={label}>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="input-base"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                />
              </div>
            ))}

            {/* Password strength */}
            {password.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-1.5 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: n <= strengthLevel ? strengthColors[strengthLevel] : 'var(--color-border)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-medium" style={{ color: strengthColors[strengthLevel] }}>
                  {strengthLabels[strengthLevel]} password
                </p>
              </div>
            )}

            {error && (
              <p className="rounded-lg px-3 py-2 text-xs text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg px-3 py-2 text-xs text-emerald-400" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create Account'}
              {!submitting && <ArrowRight className="ml-1 h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold transition-colors duration-200"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
