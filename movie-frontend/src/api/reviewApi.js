import apiClient from './apiClient';

export const createReview = ({ userId, movieId, rating, comment }) =>
  apiClient.post('/api/reviews', null, {
    params: { userId, movieId, rating, comment },
  });

export const getReviewsByMovie = (movieId) => apiClient.get(`/api/reviews/movie/${movieId}`);
export const getReviewsByUser = (userId) => apiClient.get(`/api/reviews/user/${userId}`);

export const updateReview = (reviewId, { rating, comment }) =>
  apiClient.put(`/api/reviews/${reviewId}`, null, {
    params: { rating, comment },
  });

export const deleteReview = (reviewId) => apiClient.delete(`/api/reviews/${reviewId}`);
