import { useEffect, useState } from 'react';
import { Megaphone, Calendar, Info } from 'lucide-react';
import { getAnnouncements } from '../services/announcementService.js';
import Loader from '../components/Loader.jsx';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncements();
        setAnnouncements(data || []);
      } catch (err) {
        setError('Failed to load announcements.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) return <div className="py-20"><Loader /></div>;

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <header className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
           <Megaphone className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Announcements</h1>
        <p className="text-slate-600">Stay up to date with the latest news, updates, and community highlights.</p>
      </header>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && announcements.length === 0 ? (
        <div className="rounded-3xl bg-white p-20 text-center ring-1 ring-slate-200">
           <Info className="mx-auto mb-4 h-10 w-10 text-slate-300" />
           <p className="text-slate-500">No announcements at this time. Check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {announcements.map((ann) => (
            <article 
              key={ann._id} 
              className={`relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 transition hover:shadow-md ${
                ann.important ? 'ring-rose-200 bg-rose-50/20' : 'ring-slate-200'
              }`}
            >
              {ann.important && (
                <div className="absolute right-0 top-0 rounded-bl-2xl bg-rose-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Important
                </div>
              )}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
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
                  <h2 className="text-xl font-bold text-slate-900">{ann.title}</h2>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{ann.content}</p>
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
