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
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-[#1a1a1a] relative">
        <img
          src={poster}
          alt={movie.Title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {showRecentlyAdded && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-netput-red text-white text-xs font-semibold rounded">
            Recently added
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
          {onPlay && (
            <button
              onClick={handlePlay}
              className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-black hover:bg-white transition-colors"
              aria-label="Play"
            >
              <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
          <button
            onClick={handleMyList}
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            aria-label={inList ? 'Remove from list' : 'Add to list'}
          >
            {inList ? (
              <svg className="w-5 h-5 text-netput-red" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-netput-red transition-colors">
          {movie.Title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{movie.Year}</span>
          <span>•</span>
          <span className="capitalize">{movie.Type}</span>
        </div>
      </div>
    </div>
  );
}
