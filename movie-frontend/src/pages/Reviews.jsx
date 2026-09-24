import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createReview, deleteReview, getReviewsByUser, updateReview } from '../api/reviewApi';
import { getUserFavorites } from '../api/favoriteApi';
import Spinner from '../components/Spinner';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ movieId: '', rating: 5, comment: '' });
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [revRes, favRes] = await Promise.allSettled([
        getReviewsByUser(user.id),
        getUserFavorites(user.id),
      ]);

      if (revRes.status === 'fulfilled') {
        setReviews(Array.isArray(revRes.value.data) ? revRes.value.data : []);
      }
      if (favRes.status === 'fulfilled') {
        setFavorites(Array.isArray(favRes.value.data) ? favRes.value.data : []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!user?.id || !form.movieId || !form.comment.trim()) {
      setError('Please select or specify a movie and enter your review comment.');
      return;
    }

    const cleanedMovieId = Number(form.movieId);
    const cleanedRating = Number(form.rating);

    if (!Number.isFinite(cleanedMovieId) || cleanedMovieId <= 0) {
      setError('A valid movie must be selected.');
      return;
    }

    if (!Number.isFinite(cleanedRating) || cleanedRating < 1 || cleanedRating > 5) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    try {
      if (editingId) {
        await updateReview(editingId, { rating: cleanedRating, comment: form.comment.trim() });
        setSuccess('Review updated successfully.');
      } else {
        await createReview({
          userId: user.id,
          movieId: cleanedMovieId,
          rating: cleanedRating,
          comment: form.comment.trim(),
        });
        setSuccess('Review published successfully.');
      }

      setForm({ movieId: '', rating: 5, comment: '' });
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Review operation failed.');
    }
  };

  const handleDelete = async (reviewId) => {
    setError('');
    setSuccess('');
    try {
      await deleteReview(reviewId);
      setSuccess('Review deleted.');
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete review.');
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setError('');
    setSuccess('');
    setForm({
      movieId: review.movie?.id || review.movieId || '',
      rating: review.rating || 5,
      comment: review.comment || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300 font-semibold">Community &amp; Ratings</p>
        <h1 className="mt-2 text-3xl font-black text-white text-left">Your Reviews</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Review Form */}
        <form onSubmit={handleSubmit} className="h-fit rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white text-left">
            {editingId ? '✏️ Edit Review' : '✍️ Write a Review'}
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Select Movie
              </label>
              {favorites.length > 0 && !editingId ? (
                <div className="space-y-2">
                  <select
                    value={form.movieId}
                    onChange={(event) => setForm((prev) => ({ ...prev, movieId: event.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="">-- Choose from your favorites --</option>
                    {favorites.map((fav) => (
                      <option key={fav.id} value={fav.movie?.id}>
                        {fav.movie?.title || `Movie #${fav.movie?.id}`}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">Or enter backend movie ID directly below:</p>
                </div>
              ) : null}
              <input
                value={form.movieId}
                onChange={(event) => setForm((prev) => ({ ...prev, movieId: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-white text-sm focus:outline-none focus:border-violet-500 mt-1"
                placeholder="Backend Movie ID"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Rating
              </label>
              <select
                value={form.rating}
                onChange={(event) => setForm((prev) => ({ ...prev, rating: Number(event.target.value) }))}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 / 5)</option>
                <option value={4}>⭐⭐⭐⭐ (4 / 5)</option>
                <option value={3}>⭐⭐⭐ (3 / 5)</option>
                <option value={2}>⭐⭐ (2 / 5)</option>
                <option value={1}>⭐ (1 / 5)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Comment
              </label>
              <textarea
                value={form.comment}
                onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-500"
                placeholder="What did you think of the story, acting, and experience?"
                required
              />
            </div>

            {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</div>}
            {success && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">{success}</div>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-500 py-3 font-semibold text-white transition text-sm shadow-lg shadow-violet-950/50"
              >
                {editingId ? 'Update Review' : 'Publish Review'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ movieId: '', rating: 5, comment: '' });
                  }}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <Spinner label="Loading your reviews..." />
          ) : reviews.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center">
              <p className="text-xl font-bold text-white">No reviews published yet</p>
              <p className="mt-2 text-slate-400 text-sm">
                Explore movies or TV shows on the homepage to leave ratings and share your thoughts.
              </p>
              <Link
                to="/"
                className="mt-6 inline-block rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition"
              >
                Discover Titles
              </Link>
            </div>
          ) : (
            reviews.map((review) => {
              const movieTitle = review.movie?.title || `Movie #${review.movie?.id || review.movieId}`;
              const poster = review.movie?.posterPath ? `${IMAGE_BASE}${review.movie.posterPath}` : '/No-Poster.png';
              const detailUrl = review.movie?.tmdbId
                ? (review.movie?.mediaType === 'tv' ? `/tv/${review.movie.tmdbId}` : `/movie/${review.movie.tmdbId}`)
                : null;

              return (
                <div key={review.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-6 shadow-xl hover:border-violet-500/20 transition">
                  <div className="flex gap-4 items-start">
                    <img
                      src={poster}
                      alt={movieTitle}
                      className="w-16 h-24 object-cover rounded-xl border border-white/10 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {detailUrl ? (
                          <Link to={detailUrl} className="text-lg font-bold text-white hover:text-violet-300 transition truncate">
                            {movieTitle}
                          </Link>
                        ) : (
                          <h3 className="text-lg font-bold text-white truncate">{movieTitle}</h3>
                        )}
                        <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300">
                          {'★'.repeat(review.rating || 5)}{'☆'.repeat(5 - (review.rating || 5))}
                        </span>
                      </div>

                      <p className="mt-2 text-slate-200 text-sm leading-relaxed">{review.comment}</p>

                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-xs text-slate-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(review)}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(review.id)}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
