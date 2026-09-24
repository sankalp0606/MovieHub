import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addFavorite, checkFavorite, removeFavorite, resolveBackendMovieIdForTmdbItem } from '../api/favoriteApi';
import { useEffect, useMemo, useState } from 'react';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ item, onFavoriteChange }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [backendMovieId, setBackendMovieId] = useState(null);
  const [favoriteError, setFavoriteError] = useState('');

  const itemMovie = item?.movie || {};
  const movieId = item?.tmdbId ?? item?.tmdb_id ?? itemMovie.tmdbId ?? itemMovie.tmdb_id ?? item?.id;
  const detectedType = item?.media_type || item?.mediaType || itemMovie.mediaType || itemMovie.media_type || (item?.first_air_date || (item?.name && !item?.title) ? 'tv' : 'movie');
  const mediaType = detectedType.toLowerCase();
  const title = item?.title || item?.name || itemMovie.title || itemMovie.name || 'Untitled';
  const releaseDate = item?.release_date || item?.first_air_date || item?.releaseDate || itemMovie.release_date || itemMovie.first_air_date || 'Unknown date';
  const posterPath = item?.poster_path || item?.posterPath || itemMovie.poster_path || itemMovie.posterPath;
  const poster = posterPath ? `${IMAGE_BASE}${posterPath}` : '/No-Poster.png';
  const voteAverage = item?.vote_average ?? item?.voteAverage ?? 0;

  const detailPath = useMemo(() => {
    if (mediaType === 'tv') return `/tv/${movieId}`;
    return `/movie/${movieId}`;
  }, [mediaType, movieId]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!isAuthenticated || !user?.id || !movieId) return;

      try {
        const resolvedId = await resolveBackendMovieIdForTmdbItem({
          tmdbId: movieId,
          mediaType,
          title,
          posterPath,
        });

        setBackendMovieId(resolvedId);
        const response = await checkFavorite(user.id, resolvedId);
        const favoriteData = response.data;
        setIsFavorited(typeof favoriteData === 'boolean' ? favoriteData : Boolean(favoriteData?.favorited || favoriteData?.isFavorite));
      } catch {
        setBackendMovieId(null);
        setIsFavorited(false);
      }
    };

    checkStatus();
  }, [isAuthenticated, mediaType, movieId, posterPath, title, user?.id]);

  const handleFavoriteToggle = async (event) => {
    event.stopPropagation();

    if (!isAuthenticated || !user?.id || !movieId) {
      navigate('/login');
      return;
    }

    setLoadingFavorite(true);
    setFavoriteError('');

    try {
      const resolvedId = backendMovieId ?? await resolveBackendMovieIdForTmdbItem({
        tmdbId: movieId,
        mediaType,
        title,
          posterPath,
      });

      setBackendMovieId(resolvedId);

      if (isFavorited) {
        await removeFavorite(user.id, resolvedId);
        setIsFavorited(false);
        onFavoriteChange?.(false);
      } else {
        await addFavorite(user.id, resolvedId);
        setIsFavorited(true);
        onFavoriteChange?.(true);
      }
    } catch (error) {
      setFavoriteError(error?.response?.data?.message || 'Unable to update favorite.');
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg transition hover:-translate-y-1 hover:border-violet-400/40"
      onClick={() => navigate(detailPath)}
    >
      <div className="relative">
        <img src={poster} alt={title} className="aspect-[2/3] h-auto w-full object-cover" />
        <button
          type="button"
          onClick={handleFavoriteToggle}
          className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-2 py-1 text-lg text-white ring-1 ring-white/10"
          aria-label={isFavorited ? 'Remove favorite' : 'Add favorite'}
          disabled={loadingFavorite}
        >
          {loadingFavorite ? '…' : isFavorited ? '♥' : '♡'}
        </button>
        {favoriteError && <p className="absolute bottom-2 left-2 right-2 rounded bg-red-950/90 px-2 py-1 text-xs text-red-200">{favoriteError}</p>}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-white">{title}</h3>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-1 text-xs text-violet-200">{mediaType === 'tv' ? 'TV' : 'Movie'}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{releaseDate}</span>
          <span>⭐ {Number(voteAverage).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
