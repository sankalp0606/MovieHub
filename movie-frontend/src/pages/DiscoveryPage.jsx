import { useCallback, useEffect, useRef, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import Spinner from '../components/Spinner';

const getItemKey = (item, defaultMediaType) =>
  `${item.media_type || item.mediaType || defaultMediaType || 'movie'}-${item.id || item.tmdbId}`;

const DiscoveryPage = ({ title, subtitle, fetchFn, defaultMediaType }) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [paginationError, setPaginationError] = useState('');

  const sentinelRef = useRef(null);

  // Initial page load
  useEffect(() => {
    let active = true;

    fetchFn(1)
      .then((response) => {
        if (!active) return;
        const rawResults = Array.isArray(response.data)
          ? response.data
          : response.data?.results || response.data?.content || [];
        const total = response.data?.total_pages || response.data?.totalPages || 1;
        const page = response.data?.page || 1;

        const normalized = rawResults.map((item) => {
          if (!item.media_type && !item.mediaType && defaultMediaType) {
            return { ...item, media_type: defaultMediaType };
          }
          return item;
        });

        setItems(normalized);
        setCurrentPage(page);
        setTotalPages(total);
        setHasMore(page < total && normalized.length > 0);
        setError('');
        setPaginationError('');
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || 'Unable to load titles.');
        setItems([]);
      })
      .finally(() => {
        if (active) setInitialLoading(false);
      });

    return () => {
      active = false;
    };
  }, [defaultMediaType, fetchFn]);

  // Load more pages
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || initialLoading || paginationError) return;

    const nextPage = currentPage + 1;
    setLoadingMore(true);
    setPaginationError('');

    try {
      const response = await fetchFn(nextPage);
      const rawResults = Array.isArray(response.data)
        ? response.data
        : response.data?.results || response.data?.content || [];
      const total = response.data?.total_pages || response.data?.totalPages || totalPages;
      const returnedPage = response.data?.page || nextPage;

      const normalized = rawResults.map((item) => {
        if (!item.media_type && !item.mediaType && defaultMediaType) {
          return { ...item, media_type: defaultMediaType };
        }
        return item;
      });

      setItems((prevItems) => {
        const existingKeys = new Set(prevItems.map((item) => getItemKey(item, defaultMediaType)));
        const newItems = normalized.filter(
          (item) => !existingKeys.has(getItemKey(item, defaultMediaType))
        );
        return [...prevItems, ...newItems];
      });

      setCurrentPage(returnedPage);
      setTotalPages(total);
      if (returnedPage >= total || rawResults.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      setPaginationError(
        err?.response?.data?.message || 'Failed to load more titles. Click retry to try again.'
      );
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, defaultMediaType, fetchFn, hasMore, initialLoading, loadingMore, paginationError, totalPages]);

  // IntersectionObserver for infinite scrolling
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || initialLoading || loadingMore || paginationError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '250px',
        threshold: 0.05,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, initialLoading, loadingMore, paginationError, loadMore]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300 font-semibold">{subtitle || 'Discover'}</p>
        <h1 className="mt-2 text-4xl font-black text-white text-left">{title}</h1>
      </div>

      {initialLoading ? (
        <Spinner label="Curating titles..." />
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-200">{error}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-slate-300 text-center">
          No titles found.
        </div>
      ) : (
        <>
          <MovieGrid items={items} />

          {/* Sentinel for infinite scroll */}
          {hasMore && !paginationError && (
            <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />
          )}

          {loadingMore && (
            <div className="mt-8 flex justify-center py-4">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-violet-300">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                <span>Loading more titles...</span>
              </div>
            </div>
          )}

          {paginationError && (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/30 p-4 text-center">
              <p className="text-sm text-red-200">{paginationError}</p>
              <button
                type="button"
                onClick={() => {
                  setPaginationError('');
                  loadMore();
                }}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-500"
              >
                Retry
              </button>
            </div>
          )}

          {!hasMore && items.length > 0 && (
            <div className="mt-12 text-center text-xs tracking-wider text-slate-500 uppercase">
              You've reached the end of the collection
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default DiscoveryPage;
