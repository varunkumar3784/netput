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
    <section className="relative w-full h-[80vh] md:h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-netput-dark via-transparent to-transparent z-10" />
        <img
          key={currentMovie.imdbID}
          src={
            currentMovie.Poster && currentMovie.Poster !== 'N/A'
              ? currentMovie.Poster.replace('SX300', 'SX1000')
              : POSTER_PLACEHOLDER
          }
          alt={currentMovie.Title}
          className="w-full h-full object-cover animate-ken-burns transition-opacity duration-1000"
        />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col items-start pt-20">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 border border-white/40 rounded text-[10px] uppercase tracking-widest font-bold text-white bg-black/40">
            {currentMovie.Type === 'series' ? 'Series' : 'Movie'}
          </span>
          <span className="text-sm text-gray-300 font-medium">Included with Netput</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-4 max-w-3xl leading-tight">
          {currentMovie.Title}
        </h1>

        <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8 line-clamp-3 drop-shadow-md">
          Experience the epic journey of {currentMovie.Title}. {currentMovie.Year} | Full HD | 5.1
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onPlay(currentMovie)}
            className="flex items-center gap-3 px-10 py-4 bg-[#00A8E1] text-white font-bold rounded-md hover:bg-[#0092c3] transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Now
          </button>

          <button
            className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20"
            aria-label="Add to watch list"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Carousel indicators */}
        <div className="flex gap-3 mt-12">
          {displayedMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#00A8E1] w-10' : 'bg-white/30 w-1.5 hover:bg-white/50'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
