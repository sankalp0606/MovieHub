import apiClient from './apiClient';
import { ensureBackendMovie } from './movieApi';

export const addFavorite = (userId, movieId) =>
  apiClient.post(`/api/favorites/${userId}/${movieId}`);

export const removeFavorite = (userId, movieId) =>
  apiClient.delete(`/api/favorites/${userId}/${movieId}`);

export const getUserFavorites = (userId) =>
  apiClient.get(`/api/favorites/user/${userId}`);

export const checkFavorite = (userId, movieId) =>
  apiClient.get(`/api/favorites/check/${userId}/${movieId}`);

export const resolveBackendMovieIdForTmdbItem = async ({ tmdbId, mediaType, title, posterPath }) => {
  const movieRecord = await ensureBackendMovie({ tmdbId, mediaType, title, posterPath });
  const backendMovieId = Number(movieRecord.id ?? movieRecord.movieId ?? movieRecord.movie_id);

  if (!Number.isFinite(backendMovieId)) {
    throw new Error('Backend movie record is missing its identifier.');
  }

  return backendMovieId;
};
