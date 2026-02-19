import { useState, useEffect } from 'react';
import type { Movie } from '../../types';

const POSTER_PLACEHOLDER =
  'https://via.placeholder.com/1920x1080/1a1a1a/666?text=No+Image';

interface HeroSectionProps {
  recentMovies: Movie[];
  onPlay: (movie: Movie) => void;
}

export function HeroSection({ recentMovies, onPlay }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayedMovies = recentMovies.slice(0, 5);

  useEffect(() => {
    if (displayedMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayedMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayedMovies.length]);

  if (displayedMovies.length === 0) {
    return (
      <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center justify-center pb-16 md:pb-24 bg-netput-dark">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg text-center">
            Netput
          </h1>
        </div>
      </section>
    );
  }

  const currentMovie = displayedMovies[currentIndex];

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-end pb-16 md:pb-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 gap-2 opacity-30">
          {displayedMovies.map((movie, idx) => {
            const moviePoster =
              movie.Poster && movie.Poster !== 'N/A'
                ? movie.Poster
                : POSTER_PLACEHOLDER;
            return (
              <div
                key={movie.imdbID}
                className={`relative overflow-hidden transition-opacity duration-1000 ${
                  idx === currentIndex ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <img
                  src={moviePoster}
                  alt={movie.Title}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-netput-dark via-netput-dark/80 to-netput-dark/40" />
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-6 max-w-2xl">
          Movie World
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onPlay(currentMovie)}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
        </div>
        <div className="flex gap-2 mt-6">
          {displayedMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
