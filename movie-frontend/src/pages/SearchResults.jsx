import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import Spinner from '../components/Spinner';
import { searchTmdb } from '../api/tmdbApi';
import SearchBar from '../components/SearchBar';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get('query') || '', [searchParams]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchResults = async () => {
      const trimmed = query.trim();
      if (trimmed.length < 3) {
        setResults([]);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await searchTmdb(trimmed);
        if (active) {
          const items = Array.isArray(response.data?.results)
            ? response.data.results.filter((item) => item.media_type === 'movie' || item.media_type === 'tv' || !item.media_type)
            : [];
          setResults(items);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || 'Unable to load search results.');
          setResults([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchResults();
    return () => { active = false; };
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Search</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Results for “{query}”</h1>
        </div>
      </div>
      <SearchBar key={query} initialQuery={query} />

      {loading ? (
        <Spinner label="Searching movies and TV shows..." />
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-200">{error}</div>
      ) : query.trim().length < 3 ? (
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">Type at least 3 characters to search movies or TV shows.</div>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">No results found for this search.</div>
      ) : (
        <MovieGrid items={results} />
      )}
    </div>
  );
};

export default SearchResults;
