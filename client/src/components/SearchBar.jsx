import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const SearchBar = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const q = params.get('q') ?? '';
    setQuery(q);
  }, [params]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm shadow-sm focus-within:border-(--color-primary) focus-within:bg-white"
    >
      <Search className="mr-2 h-4 w-4 text-(--color-text-light)" />
      <input
        type="search"
        placeholder="Search stories, tags, and authors"
        className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none sm:text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;

