import apiClient from './apiClient';

export const getMovies = () => apiClient.get('/api/movies');
export const getMovieById = (movieId) => apiClient.get(`/api/movies/${movieId}`);
export const findMovieByTmdb = (tmdbId, mediaType = 'movie') =>
  apiClient.get('/api/movies/find', { params: { tmdbId, mediaType: mediaType.toLowerCase() } });
export const createMovie = (payload) => apiClient.post('/api/movies', payload);

export const ensureBackendMovie = async ({ tmdbId, mediaType, title, posterPath }) => {
  const normalizedType = (mediaType || 'movie').toString().toLowerCase();
  const numericTmdbId = Number(tmdbId);

  if (!Number.isFinite(numericTmdbId)) {
    throw new Error('Missing TMDB movie identifier.');
  }

  try {
    const found = await findMovieByTmdb(numericTmdbId, normalizedType);
    if (found?.data?.id) {
      return found.data;
    }
  } catch {
    // If not found in local database, proceed to create
  }

  const createPayload = {
    tmdbId: numericTmdbId,
    mediaType: normalizedType,
    title: title || 'Untitled',
    posterPath: posterPath || '',
  };

  const created = await createMovie(createPayload);
  return created.data || created;
};
