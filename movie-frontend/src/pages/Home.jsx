import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import { getIndianMovies, getTrending, getTvShows } from '../api/tmdbApi';
import { POPULAR_GENRES } from '../config/genres';

const rows = [
  { key: 'featured', title: 'Featured Movies', icon: '✨', load: getTrending, path: '/movies' },
  { key: 'trending', title: 'Trending', icon: '🔥', load: getTrending, path: '/trending' },
  { key: 'tv', title: 'TV Shows', icon: '📺', load: getTvShows, path: '/tv-shows' },
  { key: 'indian', title: 'Indian Movies', icon: '🇮🇳', load: getIndianMovies, path: '/indian-movies' },
];

const extractResults = (data) => Array.isArray(data) ? data : data?.results || data?.content || [];
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const ContentRail = ({ row, data, error }) => (
  <section className="mt-12" aria-labelledby={`${row.key}-heading`}>
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 id={`${row.key}-heading`} className="text-2xl font-bold text-white sm:text-3xl">{row.icon} {row.title}</h2>
      <Link to={row.path} className="text-sm font-semibold text-violet-300 hover:text-white">See all <span aria-hidden="true">→</span></Link>
    </div>
    {error ? (
      <p className="rounded-xl border border-red-400/20 bg-red-950/20 p-4 text-sm text-red-200">{error}</p>
    ) : !data.length ? (
      <p className="text-slate-400">No titles available right now.</p>
    ) : (
      <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {data.map((item) => (
          <div className="w-[170px] shrink-0 sm:w-[190px]" key={`${item.media_type || item.mediaType || 'movie'}-${item.id || item.tmdbId}`}>
            <MovieCard item={item} />
          </div>
        ))}
      </div>
    )}
  </section>
);

const Home = () => {
  const [content, setContent] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all(rows.map(async (row) => {
      try {
        const response = await row.load();
        const results = extractResults(response.data);
        return [row.key, row.key === 'featured' ? shuffle(results.filter((item) => (item.media_type || item.mediaType || 'movie') === 'movie')).slice(0, 8) : results];
      }
      catch (error) { return [row.key, error?.response?.data?.message || 'Unable to load this section.']; }
    })).then((results) => {
      if (!active) return;
      const nextContent = {}; const nextErrors = {};
      results.forEach(([key, value]) => typeof value === 'string' ? (nextErrors[key] = value) : (nextContent[key] = value));
      setContent(nextContent); setErrors(nextErrors); setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-b-[2rem] border-x border-b border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(124,58,237,0.3),_transparent_40%),linear-gradient(135deg,#17112d,#090b16_60%,#111827)] px-6 py-16 sm:px-12 sm:py-24"><div className="relative max-w-3xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-violet-300">MovieHub / Discover</p><h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">Your next great watch is waiting.</h1><p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">Find the stories everyone is talking about, from Indian cinema to the latest releases.</p><div className="mt-8"><SearchBar /></div></div></section>
      {loading ? <Spinner label="Curating your home..." /> : rows.map((row) => <ContentRail key={row.key} row={row} data={content[row.key] || []} error={errors[row.key]} />)}
      <section className="mt-12" aria-labelledby="interests-heading"><div className="mb-4 flex items-end justify-between"><h2 id="interests-heading" className="text-2xl font-bold text-white sm:text-3xl">⭐ Popular Interests</h2></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{POPULAR_GENRES.map((genre) => <Link key={genre.id} to={`/genre/${genre.id}`} className={`flex aspect-[1.35] items-end rounded-2xl bg-gradient-to-br ${genre.tone} p-4 text-lg font-black text-white shadow-lg transition hover:-translate-y-1 hover:shadow-violet-950/40`}>{genre.name}</Link>)}</div></section>
    </main>
  );
};

export default Home;
