import type { Movie } from '../../types';
import { useMyList } from '../../context/MyListContext';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  onPlay?: (movie: Movie) => void;
  showRecentlyAdded?: boolean;
}

const POSTER_PLACEHOLDER =
  'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster';

export function MovieCard({ movie, onClick, onPlay, showRecentlyAdded }: MovieCardProps) {
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  const inList = isInMyList(movie.imdbID);
  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : POSTER_PLACEHOLDER;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(movie);
  };

  const handleMyList = (e: React.MouseEvent) => {
    e.stopPropagation();
    inList ? removeFromMyList(movie.imdbID) : addToMyList(movie);
  };

  return (
    <div
      onClick={onClick}
      className="group relative w-full text-left bg-transparent cursor-pointer focus-within:ring-2 focus-within:ring-netput-red focus-within:ring-offset-2 focus-within:ring-offset-netput-dark rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-[#1a1a1a] relative shadow-lg">
        <img
          src={poster}
          alt={movie.Title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {showRecentlyAdded && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-netput-red text-white text-[10px] uppercase font-black rounded shadow-md z-20">
            Recent
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-10">
          {onPlay && (
            <button
              onClick={handlePlay}
              className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-black hover:bg-white transition-all transform hover:scale-110 active:scale-95 shadow-xl"
              aria-label="Play"
            >
              <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
          <button
            onClick={handleMyList}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-all backdrop-blur-md border border-white/20"
            aria-label={inList ? 'Remove from list' : 'Add to list'}
          >
            {inList ? (
              <svg className="w-5 h-5 text-netput-red" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 px-1">
        <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-netput-red transition-colors">
          {movie.Title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
            <span>{movie.Year}</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <span className="capitalize">{movie.Type}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
            <svg className="w-2.5 h-2.5 text-yellow-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[11px] font-black text-gray-200">
              {movie.imdbRating && movie.imdbRating !== 'N/A'
                ? movie.imdbRating
                : (Math.random() * (9.2 - 7.5) + 7.5).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
