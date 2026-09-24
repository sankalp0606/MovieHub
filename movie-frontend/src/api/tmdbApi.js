import apiClient from './apiClient';

export const getTrending = (page = 1) => apiClient.get('/api/tmdb/trending', { params: { page } });
export const searchTmdb = (query) => apiClient.get('/api/tmdb/search', { params: { query } });
export const getIndianMovies = (page = 1) => apiClient.get('/api/tmdb/indian-movies', { params: { page } });
export const getTvShows = (page = 1) => apiClient.get('/api/tmdb/discover/tv', { params: { page } });
export const discoverMovies = (genreId, page = 1) => apiClient.get('/api/tmdb/discover/movie', { params: { genreId, page } });
export const discoverTv = (genreId, page = 1) => apiClient.get('/api/tmdb/discover/tv', { params: { genreId, page } });
export const getMovieDetails = (tmdbId) => apiClient.get(`/api/tmdb/movie/${tmdbId}`);
export const getTvDetails = (tmdbId) => apiClient.get(`/api/tmdb/tv/${tmdbId}`);
export const getMovieCredits = (tmdbId) => apiClient.get(`/api/tmdb/movie/${tmdbId}/credits`);
export const getTvCredits = (tmdbId) => apiClient.get(`/api/tmdb/tv/${tmdbId}/credits`);
export const getMovieVideos = (tmdbId) => apiClient.get(`/api/tmdb/movie/${tmdbId}/videos`);
export const getTvVideos = (tmdbId) => apiClient.get(`/api/tmdb/tv/${tmdbId}/videos`);
export const getMovieSimilar = (tmdbId) => apiClient.get(`/api/tmdb/movie/${tmdbId}/similar`);
export const getTvSimilar = (tmdbId) => apiClient.get(`/api/tmdb/tv/${tmdbId}/similar`);
