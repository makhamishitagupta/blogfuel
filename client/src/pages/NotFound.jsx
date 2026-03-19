import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden text-center px-4"
    >
      {/* Abstract decorative shapes */}
      <div
        className="pointer-events-none absolute"
        style={{ top: '-80px', left: '10%', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', filter: 'blur(50px)' }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ bottom: '-60px', right: '5%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ top: '30%', right: '15%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ bottom: '25%', left: '10%', width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)', transform: 'rotate(20deg)' }}
      />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div
          className="text-[clamp(5rem,18vw,10rem)] font-black leading-none tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </div>

        <h1 className="text-xl font-black sm:text-2xl" style={{ color: 'var(--color-text)' }}>
          Oops! Page not found.
        </h1>

        <p className="max-w-sm text-sm leading-relaxed mx-auto" style={{ color: 'var(--color-text-muted)' }}>
          The page you're looking for doesn't exist or may have moved. Let's get you back to your reading feed.
        </p>

        <div className="pt-2">
          <Link to="/" className="btn-primary inline-flex gap-2 px-6 py-2.5 text-sm">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
