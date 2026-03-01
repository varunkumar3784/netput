import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { HeroSection } from '../components/Movies/HeroSection';
import { GenreRow } from '../components/Movies/GenreRow';
import { MovieDetailModal } from '../components/Movies/MovieDetailModal';
import { SearchOverlay } from '../components/Movies/SearchOverlay';
import {
  fetchTop10,
  fetchRecommendations,
  fetchRecent,
  fetchCategory,
  getMovieById as backendGetMovie,
} from '../services/backendApi';
import {
  searchMovies as omdbSearch,
  getMovieById as omdbGetMovie,
  searchMoviesByYear,
  searchByGenre,
} from '../services/api';
import type { Movie } from '../types';
import { openTrailer } from '../utils/playTrailer';
import { useMyList } from '../context/MyListContext';

const CATEGORY_SECTIONS = [
  { key: 'anime', label: 'Anime & Global Animation' },
  { key: 'drama', label: 'Critically Acclaimed TV Dramas' },
  { key: 'horror', label: 'Spooky & Horror' },
  { key: 'comedy', label: 'Laughter Therapy' },
  { key: 'action', label: 'High Octane Action' },
];

async function safeBackend<T>(fn: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback();
  }
}

export function Dashboard() {
  const { myList } = useMyList();
  const [searchOpen, setSearchOpen] = useState(false);
  const [top10, setTop10] = useState<Movie[]>([]);
  const [top10Loading, setTop10Loading] = useState(true);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [genreMovies, setGenreMovies] = useState<Record<string, { movies: Movie[]; loading: boolean }>>({});
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  const loadTop10 = useCallback(async () => {
    setTop10Loading(true);
    const movies = await safeBackend(
      () => fetchTop10(),
      async () => {
        const d = await searchMoviesByYear(String(currentYear));
        return d.Response === 'True' && d.Search ? d.Search.slice(0, 10) : [];
      }
    );
    setTop10(movies);
    setTop10Loading(false);
  }, [currentYear]);

  const loadRecommendations = useCallback(async () => {
    setRecsLoading(true);
    const movies = await safeBackend(
      () => fetchRecommendations(),
      async () => {
        const d = await omdbSearch('popular');
        return d.Response === 'True' && d.Search ? d.Search : [];
      }
    );
    setRecommendations(movies);
    setRecsLoading(false);
  }, []);

  const loadRecent = useCallback(async () => {
    const movies = await safeBackend(
      () => fetchRecent(),
      async () => {
        const d = await searchMoviesByYear(String(currentYear));
        return d.Response === 'True' && d.Search ? d.Search : [];
      }
    );
    setRecentMovies(movies);
  }, [currentYear]);

  const loadGenre = useCallback(async (genre: string) => {
    setGenreMovies((prev) => ({ ...prev, [genre]: { movies: [], loading: true } }));
    const movies = await safeBackend(
      () => fetchCategory(genre),
      async () => {
        const d = await searchByGenre(genre);
        return d.Response === 'True' && d.Search ? d.Search : [];
      }
    );
    setGenreMovies((prev) => ({ ...prev, [genre]: { movies, loading: false } }));
  }, []);

  useEffect(() => {
    loadTop10();
    loadRecommendations();
    loadRecent();
    CATEGORY_SECTIONS.forEach(c => loadGenre(c.key));
  }, [loadTop10, loadRecommendations, loadRecent, loadGenre]);

  const handleMovieClick = async (movie: Movie) => {
    setDetailLoading(true);
    setSelectedMovie(movie);
    try {
      const data = await safeBackend(
        () => backendGetMovie(movie.imdbID),
        () => omdbGetMovie(movie.imdbID)
      );
      if (data?.Response === 'True') setSelectedMovie(data as Movie);
    } catch {
      setSelectedMovie(movie);
    } finally {
      setDetailLoading(false);
    }
  };

  const handlePlay = (movie: Movie) => openTrailer(movie.Title, movie.Year);

  return (
    <div className="min-h-screen bg-[#141414] pb-20 overflow-x-hidden">
      <Header
        activeTab="movies"
        onSearchTrigger={() => setSearchOpen(true)}
      />

      <main className="pb-12 -mt-20">
        <HeroSection recentMovies={recentMovies.slice(0, 5)} onPlay={handlePlay} />

        <div className="max-w-7xl mx-auto px-4 md:px-12 mt-10 relative z-10">
          {/* Top 10 with attractive numbering */}
          <section className="mb-14 overflow-visible">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
              <span className="w-1.5 h-8 bg-netput-red rounded-full shadow-glow" />
              Top 10 Today
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {top10Loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="min-w-[200px] aspect-[2/3] bg-white/5 animate-pulse rounded-2xl" />
                ))
              ) : (
                top10.map((movie, index) => (
                  <div
                    key={movie.imdbID}
                    onClick={() => handleMovieClick(movie)}
                    className="relative min-w-[180px] md:min-w-[240px] group cursor-pointer"
                  >
                    <div className="absolute -left-6 md:-left-8 bottom-[-10px] text-[150px] md:text-[220px] font-black leading-none text-transparent stroke-netput-red/30 group-hover:stroke-netput-red transition-all duration-500 select-none z-0 italic" style={{ WebkitTextStrokeWidth: '2px', WebkitTextStrokeColor: 'rgba(229, 9, 20, 0.4)' }}>
                      {index + 1}
                    </div>
                    <div className="relative z-10 ml-8 md:ml-16 overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 border border-white/5 group-hover:border-netput-red/50">
                      <img
                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster'}
                        alt={movie.Title}
                        className="w-full aspect-[2/3] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <span className="text-xs font-bold text-netput-red uppercase tracking-widest mb-1">Top Rated</span>
                        <h4 className="text-white text-sm font-black line-clamp-1">{movie.Title}</h4>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {myList.length > 0 && (
            <GenreRow title="My List" movies={myList} onMovieClick={handleMovieClick} onPlay={handlePlay} />
          )}

          <GenreRow
            title="Trending & Recommended"
            movies={recommendations}
            loading={recsLoading}
            onMovieClick={handleMovieClick}
            onPlay={handlePlay}
          />

          {CATEGORY_SECTIONS.map(({ key, label }) => (
            <GenreRow
              key={key}
              title={label}
              movies={genreMovies[key]?.movies ?? []}
              loading={genreMovies[key]?.loading ?? true}
              onMovieClick={handleMovieClick}
              onPlay={handlePlay}
            />
          ))}
        </div>
      </main>

      {selectedMovie && (
        <MovieDetailModal
          movie={detailLoading ? { ...selectedMovie, Plot: 'Loading cinematic details...' } : selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={() => handlePlay(selectedMovie)}
        />
      )}

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onMovieClick={handleMovieClick}
      />

      <BottomNav active="home" />
    </div>
  );
}
