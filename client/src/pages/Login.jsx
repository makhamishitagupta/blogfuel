import { useState } from 'react';
import { LogIn, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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
      if (!idToken) throw new Error('No ID token received from Google');
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
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl flex"
        style={{ border: '1px solid var(--color-border)' }}
      >
        {/* Left panel — purple gradient */}
        <div
          className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #3b0764 0%, #5b21b6 50%, #7c3aed 100%)' }}
        >
          {/* Decorative blobs */}
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
              Your thoughts deserve a platform.
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Sign in to continue your reading journey, manage your blogs, and connect with a community of creators.
            </p>
          </div>

          <div className="relative z-10">
            <blockquote className="text-sm text-white/60 italic border-l-2 border-white/30 pl-4">
              "The best time to write was yesterday. The second best time is now."
            </blockquote>
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
              <LogIn className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>
              Welcome Back
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Log in to continue reading and managing your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium transition-colors duration-200"
                  style={{ color: 'var(--color-primary)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="input-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p
                className="rounded-lg px-3 py-2 text-xs text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
              {!submitting && <ArrowRight className="ml-1 h-4 w-4" />}
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full" style={{ borderTop: '1px solid var(--color-border)' }} />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span
                  className="px-2 font-medium"
                  style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' }}
                >
                  or continue with
                </span>
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

          <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold transition-colors duration-200"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
