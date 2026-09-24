import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ initialQuery = '' }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const trimmedQuery = query.trim();
    const timer = setTimeout(() => {
      if (trimmedQuery.length >= 3) {
        navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
      } else if (!trimmedQuery && window.location.pathname === '/search') {
        navigate('/search', { replace: true });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [navigate, query]);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3 shadow-inner shadow-black/40 focus-within:border-violet-500/50 transition">
        <span className="pl-2 text-lg text-violet-400 select-none" aria-hidden="true">🔍</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search movies &amp; TV shows (type 3+ chars)..."
          className="w-full bg-transparent px-2 py-2 text-white placeholder:text-slate-400 focus:outline-none"
          aria-label="Search movies and TV shows"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="pr-2 text-slate-400 hover:text-white transition text-sm"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
