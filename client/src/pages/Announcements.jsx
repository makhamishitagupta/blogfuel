import { useEffect, useState } from 'react';
import { Megaphone, Calendar, Info, Pin } from 'lucide-react';
import { getAnnouncements } from '../services/announcementService.js';
import Loader from '../components/Loader.jsx';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncements();
        if (active) setAnnouncements(data || []);
      } catch (err) {
        if (active) setError('Failed to load announcements.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchAnnouncements();
    return () => { active = false; };
  }, []);

  if (loading) return <div className="py-20"><Loader /></div>;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 space-y-10">
      <header className="space-y-4 text-center">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--color-primary)' }}
        >
          <Megaphone className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
            Site Announcements
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Stay up to date with the latest news, updates, and community highlights.
          </p>
        </div>
      </header>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-center text-sm font-medium"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          {error}
        </div>
      )}

      {!loading && announcements.length === 0 ? (
        <div
          className="rounded-2xl px-8 py-16 text-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <Info className="mx-auto mb-4 h-10 w-10 opacity-40" style={{ color: 'var(--color-text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
            No announcements at this time. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {announcements.map((ann) => (
            <article
              key={ann._id}
              className="relative overflow-hidden rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: ann.important ? 'rgba(124,58,237,0.05)' : 'var(--color-surface-elevated)',
                border: ann.important ? '1px solid rgba(124,58,237,0.3)' : '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                className="absolute top-0 bottom-0 left-0 w-1"
                style={{ background: ann.important ? 'linear-gradient(to bottom, #7c3aed, #a855f7)' : 'transparent' }}
              />

              {ann.important && (
                <div
                  className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: 'var(--color-primary)' }}
                >
                  <Pin className="h-3 w-3" />
                  Important
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[11px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(ann.createdAt).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                    {ann.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>
                    {ann.content}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
