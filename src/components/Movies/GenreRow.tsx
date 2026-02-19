import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import type { Movie } from '../../types';

interface GenreRowProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onMovieClick: (movie: Movie) => void;
  onPlay?: (movie: Movie) => void;
  showRecentlyAdded?: boolean;
}

export function GenreRow({
  title,
  movies,
  loading,
  onMovieClick,
  onPlay,
  showRecentlyAdded,
}: GenreRowProps) {
  return (
    <section className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-0">
        {title}
      </h2>
      <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        <div className="flex gap-4 md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-6 min-w-max md:min-w-0">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-40 md:w-auto shrink-0">
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.map((movie) => (
                <div key={movie.imdbID} className="w-40 md:w-auto shrink-0">
                  <MovieCard movie={movie} onClick={() => onMovieClick(movie)} onPlay={onPlay} showRecentlyAdded={showRecentlyAdded} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
