import { MovieCardSkeleton } from './MovieCardSkeleton';
import type { Movie } from '../../types';

interface Top10RowProps {
  movies: Movie[];
  loading?: boolean;
  onMovieClick: (movie: Movie) => void;
  onPlay?: (movie: Movie) => void;
}

const POSTER_PLACEHOLDER = 'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster';

export function Top10Row({ movies, loading, onMovieClick, onPlay }: Top10RowProps) {
  return (
    <section className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-0">
        Top 10 Movies in Netput Today
      </h2>
      <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        <div className="flex gap-4 min-w-max">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-36 md:w-44 shrink-0">
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.map((movie, idx) => {
                const poster =
                  movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : POSTER_PLACEHOLDER;
                return (
                  <div
                    key={movie.imdbID}
                    className="w-36 md:w-44 shrink-0 group relative cursor-pointer"
                    onClick={() => onMovieClick(movie)}
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a] relative">
                      <img
                        src={poster}
                        alt={movie.Title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlay?.(movie);
                          }}
                          className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-black"
                        >
                          <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute -left-2 -top-2 w-10 h-10 rounded-lg bg-netput-red flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {idx + 1}
                      </div>
                      <span className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-netput-red/90 text-white text-xs font-medium rounded">
                        Recently added
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white font-medium line-clamp-2">{movie.Title}</p>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
