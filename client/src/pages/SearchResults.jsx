import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import BlogCard from '../components/BlogCard.jsx';
import Loader from '../components/Loader.jsx';
import { searchBlogs, getAllBlogs } from '../services/blogService.js';

const filters = ['Newest', 'Popular'];

const SearchResults = () => {
  const [params, setParams] = useSearchParams();
  const query = (params.get('q') ?? '').toLowerCase();
  const activeFilter = params.get('sort') ?? 'Newest';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = query ? await searchBlogs(query) : await getAllBlogs();
        if (!active) return;
        let blogs = data.blogs || [];
        if (activeFilter === 'Popular') {
          blogs = [...blogs].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        } else {
          blogs = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        setResults(blogs);
      } catch (err) {
        if (!active) return;
        const message = err?.response?.data?.message || err?.message || 'Search request failed.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [query, activeFilter]);

  const setFilter = (value) => {
    const next = new URLSearchParams(params);
    next.set('sort', value);
    setParams(next);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-black" style={{ color: 'var(--color-text)' }}>
            {query ? (
              <>
                Results for{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  "{query}"
                </span>
              </>
            ) : (
              'All stories'
            )}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {results.length} {results.length === 1 ? 'story' : 'stories'} found
          </p>
        </div>

        {/* Sort filters */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-3.5 w-3.5" style={{ color: 'var(--color-text-muted)' }} />
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200"
              style={
                activeFilter === f
                  ? { background: 'var(--color-primary)', color: '#fff' }
                  : { background: 'var(--color-surface)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {loading && <Loader />}

      {error && !loading && (
        <p
          className="rounded-xl px-4 py-3 text-xs text-red-400"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          {error}
        </p>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="py-20 text-center space-y-3">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'rgba(124,58,237,0.1)' }}
          >
            <Search className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            No results found
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {query ? `No stories matched "${query}". Try a different keyword.` : 'No posts published yet.'}
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((blog) => (
            <BlogCard key={blog._id || blog.id} blog={blog} />
          ))}
        </section>
      )}
    </div>
  );
};

export default SearchResults;
