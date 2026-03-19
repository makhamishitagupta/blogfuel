import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const SearchBar = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
      className="flex items-center rounded-full px-4 py-2 transition-all duration-200 outline-none w-full max-w-md"
      style={{
        background: 'var(--color-bg)',
        border: isFocused ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
        boxShadow: isFocused ? '0 0 0 2px rgba(124,58,237,0.1)' : 'none',
      }}
    >
      <Search className="mr-2 h-4 w-4" style={{ color: isFocused ? 'var(--color-primary)' : 'var(--color-text-light)' }} />
      <input
        type="search"
        placeholder="Search stories, tags..."
        className="flex-1 bg-transparent text-sm transition-colors outline-none w-full"
        style={{
          color: 'var(--color-text)',
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </form>
  );
};

export default SearchBar;
