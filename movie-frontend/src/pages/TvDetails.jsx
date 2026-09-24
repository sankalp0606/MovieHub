import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { getTvCredits, getTvDetails, getTvSimilar, getTvVideos } from '../api/tmdbApi';
import { addFavorite, checkFavorite, removeFavorite, resolveBackendMovieIdForTmdbItem } from '../api/favoriteApi';
import { createReview, getReviewsByMovie } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

const TvDetails = () => {
  const { tmdbId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [backendMovieId, setBackendMovieId] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [showRes, creditsRes, videosRes, similarRes] = await Promise.all([
          getTvDetails(tmdbId),
          getTvCredits(tmdbId),
          getTvVideos(tmdbId),
          getTvSimilar(tmdbId),
        ]);

        setShow(showRes.data);
        setCast(creditsRes.data?.cast || []);
        setCrew(creditsRes.data?.crew || []);
        setVideos(videosRes.data?.results || []);
        setSimilar(similarRes.data?.results || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load TV details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tmdbId]);

  // Resolve backend movie ID and check favorite & reviews
  useEffect(() => {
    const resolveAndFetch = async () => {
      if (!tmdbId || !show) return;

      try {
        const resolvedId = await resolveBackendMovieIdForTmdbItem({
          tmdbId: Number(tmdbId),
          mediaType: 'tv',
          title: show.name || 'TV Show',
          posterPath: show.poster_path || '',
        });

        setBackendMovieId(resolvedId);

        // Fetch reviews
        setReviewsLoading(true);
        try {
          const revRes = await getReviewsByMovie(resolvedId);
          setReviews(Array.isArray(revRes.data) ? revRes.data : []);
        } catch {
          setReviews([]);
        } finally {
          setReviewsLoading(false);
        }

        // Check favorite status if authenticated
        if (isAuthenticated && user?.id) {
          try {
            const favRes = await checkFavorite(user.id, resolvedId);
            setIsFavorited(Boolean(favRes.data === true || favRes.data?.favorited || favRes.data?.isFavorite));
          } catch {
            setIsFavorited(false);
          }
        }
      } catch {
        // Silently continue
      }
    };

    resolveAndFetch();
  }, [isAuthenticated, show, tmdbId, user?.id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !user?.id) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);

    try {
      const resolvedId = backendMovieId ?? await resolveBackendMovieIdForTmdbItem({
        tmdbId: Number(tmdbId),
        mediaType: 'tv',
        title: show?.name || 'TV Show',
        posterPath: show?.poster_path || '',
      });

      setBackendMovieId(resolvedId);

      if (isFavorited) {
        await removeFavorite(user.id, resolvedId);
        setIsFavorited(false);
      } else {
        await addFavorite(user.id, resolvedId);
        setIsFavorited(true);
      }
    } catch {
      // Favorite update failed
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user?.id) {
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please enter a review comment.');
      return;
    }
    if (!backendMovieId) {
      setReviewError('Unable to link show for review.');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      await createReview({
        userId: user.id,
        movieId: backendMovieId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewComment('');
      setReviewRating(5);
      setReviewSuccess('Review published successfully!');
      // Reload reviews
      const updated = await getReviewsByMovie(backendMovieId);
      setReviews(Array.isArray(updated.data) ? updated.data : []);
    } catch (err) {
      setReviewError(err?.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10"><Spinner label="Loading TV details..." /></div>;
  if (error) return <div className="mx-auto max-w-7xl px-4 py-10"><div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-200">{error}</div></div>;
  if (!show) return null;

  const trailer = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube') || videos[0];
  const creators = show.created_by || [];
  const keyCrew = crew.filter((p) => p.job === 'Executive Producer' || p.job === 'Director').slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        {show.backdrop_path && (
          <img src={`${BACKDROP_BASE}${show.backdrop_path}`} alt={show.name} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <div className="relative grid gap-8 p-6 md:grid-cols-[280px_1fr] md:p-10">
          <img
            src={show.poster_path ? `${IMAGE_BASE}${show.poster_path}` : '/No-Poster.png'}
            alt={show.name}
            className="h-[420px] w-full rounded-2xl object-cover shadow-2xl border border-white/10"
          />

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black text-white text-left">{show.name}</h1>
              <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs text-violet-200 font-semibold">TV Series</span>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-slate-300">
              <span className="flex items-center gap-1 font-semibold text-amber-300">⭐ {Number(show.vote_average || 0).toFixed(1)}</span>
              <span>📅 First Aired: {show.first_air_date || 'Unknown date'}</span>
              <span>📺 {show.number_of_seasons || 0} Seasons ({show.number_of_episodes || 0} Episodes)</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(show.genres || []).map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genre/${genre.id}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-violet-500/20 hover:border-violet-400/40 transition"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <p className="max-w-3xl text-slate-200 leading-relaxed text-base">{show.overview || 'No overview available.'}</p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-3 font-semibold text-white transition shadow-lg shadow-violet-950/50 disabled:opacity-50"
              >
                <span>{isFavorited ? '❤️' : '🤍'}</span>
                <span>{favoriteLoading ? 'Updating...' : isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer */}
      {trailer && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-white">🎬 Official Trailer</h2>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-xl aspect-video max-w-4xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl border-0"
            />
          </div>
        </section>
      )}

      {/* Creators & Key Crew */}
      {(creators.length > 0 || keyCrew.length > 0) && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-white">🎥 Creators &amp; Showrunners</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {creators.map((person) => (
              <div key={`creator-${person.id}`} className="rounded-xl border border-white/10 bg-slate-900/80 p-4">
                <span className="text-xs uppercase tracking-wider text-violet-400 font-semibold">Creator</span>
                <h3 className="mt-1 font-bold text-white">{person.name}</h3>
              </div>
            ))}
            {keyCrew.map((person, idx) => (
              <div key={`crew-${person.id}-${idx}`} className="rounded-xl border border-white/10 bg-slate-900/80 p-4">
                <span className="text-xs uppercase tracking-wider text-violet-400 font-semibold">{person.job || 'Producer'}</span>
                <h3 className="mt-1 font-bold text-white">{person.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seasons list if available */}
      {Array.isArray(show.seasons) && show.seasons.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-white">📂 Seasons ({show.seasons.length})</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {show.seasons.map((season) => (
              <div key={season.id} className="w-[160px] shrink-0 rounded-xl border border-white/10 bg-slate-900/80 p-3">
                <img
                  src={season.poster_path ? `${IMAGE_BASE}${season.poster_path}` : '/No-Poster.png'}
                  alt={season.name}
                  className="h-44 w-full rounded-lg object-cover"
                />
                <h4 className="mt-2 text-sm font-semibold text-white line-clamp-1">{season.name}</h4>
                <p className="text-xs text-slate-400">{season.episode_count || 0} Episodes</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cast */}
      {cast.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-white">👥 Top Cast</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cast.slice(0, 8).map((person) => (
              <div key={person.id} className="rounded-xl border border-white/10 bg-slate-900/80 p-3 hover:border-violet-500/30 transition">
                <img
                  src={person.profile_path ? `${IMAGE_BASE}${person.profile_path}` : '/No-Poster.png'}
                  alt={person.name}
                  className="h-52 w-full rounded-lg object-cover"
                />
                <h3 className="mt-3 font-semibold text-white">{person.name}</h3>
                <p className="text-sm text-slate-400">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="mt-14 border-t border-white/10 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">💬 Audience Reviews ({reviews.length})</h2>
            <p className="text-sm text-slate-400">Share your thoughts on this series</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Reviews list */}
          <div className="space-y-4">
            {reviewsLoading ? (
              <Spinner label="Loading reviews..." />
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-400">
                No reviews yet. Be the first to review this show!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-300">
                        {(rev.user?.name || rev.user?.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{rev.user?.name || rev.user?.email || 'Anonymous'}</p>
                        <p className="text-xs text-slate-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-sm font-bold text-amber-300">
                      {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))}
                    </span>
                  </div>
                  <p className="mt-3 text-slate-200 leading-relaxed text-sm">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write Review Form */}
          <div className="h-fit rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white">Leave a Review</h3>
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 / 5 - Masterpiece)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 / 5 - Great)</option>
                    <option value={3}>⭐⭐⭐ (3 / 5 - Good)</option>
                    <option value={2}>⭐⭐ (2 / 5 - Mediocre)</option>
                    <option value={1}>⭐ (1 / 5 - Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Comment</label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="What did you think of the seasons, characters, and plot?"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 text-sm"
                  />
                </div>

                {reviewError && (
                  <p className="rounded-lg bg-red-950/50 border border-red-500/30 p-2 text-xs text-red-200">{reviewError}</p>
                )}
                {reviewSuccess && (
                  <p className="rounded-lg bg-emerald-950/50 border border-emerald-500/30 p-2 text-xs text-emerald-200">{reviewSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 py-3 font-semibold text-white transition disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-400 mb-4">Please log in to submit your rating and review.</p>
                <Link
                  to="/login"
                  className="inline-block rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition"
                >
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Similar TV Shows */}
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-2xl font-bold text-white">✨ Similar Shows You May Like</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {similar.slice(0, 8).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate(`/tv/${item.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 hover:border-violet-400/40 hover:-translate-y-1 transition"
              >
                <img
                  src={item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : '/No-Poster.png'}
                  alt={item.name}
                  className="h-64 w-full object-cover"
                />
                <div className="p-3">
                  <h3 className="line-clamp-1 text-white font-semibold text-sm">{item.name}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>{item.first_air_date || 'Unknown date'}</span>
                    <span>⭐ {Number(item.vote_average || 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TvDetails;
