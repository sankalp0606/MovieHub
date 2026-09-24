import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-black tracking-tight text-white">
              Movie<span className="text-violet-400">Hub</span>
            </Link>
            <span className="text-xs text-slate-400">| Cinematic Discovery Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/movies" className="hover:text-white transition">Movies</Link>
            <Link to="/tv-shows" className="hover:text-white transition">TV Shows</Link>
            <Link to="/trending" className="hover:text-white transition">Trending</Link>
            <Link to="/search" className="hover:text-white transition">Search</Link>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className="mt-4 text-xs text-slate-500 sm:mt-0">
            &copy; {new Date().getFullYear()} MovieHub. Created by Sankalp.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
