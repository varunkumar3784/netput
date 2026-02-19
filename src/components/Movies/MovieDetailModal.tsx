import { useEffect } from 'react';
import type { Movie } from '../../types';
import { useMyList } from '../../context/MyListContext';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay?: (movie: Movie) => void;
}

const POSTER_PLACEHOLDER =
  'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster';

export function MovieDetailModal({ movie, onClose, onPlay }: MovieDetailModalProps) {
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!movie) return null;

  const poster =
    movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : POSTER_PLACEHOLDER;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] rounded-lg shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <img
            src={poster}
            alt={movie.Title}
            className="w-full md:w-48 h-auto object-cover rounded-lg shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white mb-2">{movie.Title}</h2>
            <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-4">
              <span>{movie.Year}</span>
              <span>•</span>
              <span className="capitalize">{movie.Type}</span>
              {movie.Runtime && (
                <>
                  <span>•</span>
                  <span>{movie.Runtime}</span>
                </>
              )}
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <>
                  <span>•</span>
                  <span className="text-yellow-400">★ {movie.imdbRating}</span>
                </>
              )}
            </div>
            {movie.Genre && movie.Genre !== 'N/A' && (
              <p className="text-gray-300 mb-2">
                <span className="text-gray-500">Genre:</span> {movie.Genre}
              </p>
            )}
            {movie.Director && movie.Director !== 'N/A' && (
              <p className="text-gray-300 mb-2">
                <span className="text-gray-500">Director:</span> {movie.Director}
              </p>
            )}
            {movie.Actors && movie.Actors !== 'N/A' && (
              <p className="text-gray-300 mb-4">
                <span className="text-gray-500">Cast:</span> {movie.Actors}
              </p>
            )}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <p className="text-gray-300 text-sm leading-relaxed">{movie.Plot}</p>
            )}
            {onPlay && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onPlay(movie)}
                  className="flex items-center gap-2 px-6 py-2 bg-netput-red hover:bg-netput-red-hover text-white font-semibold rounded transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Trailer
                </button>
                <button
                  onClick={() =>
                    isInMyList(movie.imdbID)
                      ? removeFromMyList(movie.imdbID)
                      : addToMyList(movie)
                  }
                  className={`flex items-center gap-2 px-6 py-2 rounded font-semibold transition-colors ${
                    isInMyList(movie.imdbID)
                      ? 'bg-netput-red text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {isInMyList(movie.imdbID) ? (
                    <>✓ In My List</>
                  ) : (
                    <>+ My List</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
