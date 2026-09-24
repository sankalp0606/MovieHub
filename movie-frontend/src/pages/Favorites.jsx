import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserFavorites } from '../api/favoriteApi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await getUserFavorites(user.id);
        const items = response.data || [];
        setFavorites(items);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load favorites.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Your list</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Favorites</h1>
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading favorites..." />
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-200">{error}</div>
      ) : favorites.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-10 text-center">
          <p className="text-xl font-semibold text-white">No favorites yet.</p>
          <p className="mt-2 text-slate-300">Explore the homepage and save the titles you want to revisit.</p>
          <Link to="/" className="mt-6 inline-block rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white">Browse titles</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {favorites.map((item, index) => {
            const movieRecord = item.movie || item;
            return <MovieCard key={`${movieRecord.id || movieRecord.tmdbId}-${index}`} item={movieRecord} onFavoriteChange={(favorited) => { if (!favorited) setFavorites((current) => current.filter((_, currentIndex) => currentIndex !== index)); }} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
