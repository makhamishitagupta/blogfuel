import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();
  const location = useLocation();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setSubmitting(true);

      const idToken = credentialResponse.credential;
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      await googleLogin(idToken);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.status ||
        err.message ||
        'Unable to log in with Google. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login error');
    setError('Google login failed. Please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.status ||
        'Unable to log in. Please check your credentials.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-sm">
          <LogIn className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Welcome back</h1>
          <p className="text-xs text-[var(--color-text-light)]">
            Log in to continue reading and managing your dashboard.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Log in'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">Or</span>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="400"
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;

