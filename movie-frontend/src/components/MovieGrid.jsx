import MovieCard from './MovieCard';

const MovieGrid = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
        No items available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MovieCard key={`${item.media_type || item.mediaType || 'movie'}-${item.id}`} item={item} />
      ))}
    </div>
  );
};

export default MovieGrid;
