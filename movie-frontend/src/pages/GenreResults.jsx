import { useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import DiscoveryPage from './DiscoveryPage';
import { discoverMovies } from '../api/tmdbApi';
import { POPULAR_GENRES } from '../config/genres';

const GenreResults = () => {
  const { genreId: paramGenreId } = useParams();
  const [searchParams] = useSearchParams();
  const rawGenreId = paramGenreId || searchParams.get('genreId') || '';
  const genreId = Number(rawGenreId) || rawGenreId;

  const genre = POPULAR_GENRES.find((item) => String(item.id) === String(rawGenreId));
  const fetchFn = useCallback((page) => discoverMovies(genreId, page), [genreId]);

  return (
    <DiscoveryPage
      key={rawGenreId}
      title={genre?.name || 'Genre'}
      subtitle="Browse by genre"
      fetchFn={fetchFn}
      defaultMediaType="movie"
    />
  );
};

export default GenreResults;