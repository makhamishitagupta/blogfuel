import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
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
        const data = query
          ? await searchBlogs(query)
          : await getAllBlogs();
        if (!active) return;
        let blogs = data.blogs || [];
        if (activeFilter === 'Popular') {
          blogs = [...blogs].sort(
            (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0),
          );
        } else {
          blogs = [...blogs].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
        }
        setResults(blogs);
      } catch (err) {
        if (!active) return;
        const message =
          err?.response?.data?.message || err?.message || 'Search request failed.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [query, activeFilter]);

  const setFilter = (value) => {
    const next = new URLSearchParams(params);
    next.set('sort', value);
    setParams(next);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">
            Search results{query ? ` for “${query}”` : ''}
          </h1>
          <p className="text-xs text-(--color-text-light)">
            {results.length} {results.length === 1 ? 'story' : 'stories'} found
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-2.5 py-1 ${
                activeFilter === f
                  ? 'bg-(--color-primary) text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {loading && <Loader />}
      {error && !loading && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!loading && (
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

