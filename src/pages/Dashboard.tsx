import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { HeroSection } from '../components/Movies/HeroSection';
import { Top10Row } from '../components/Movies/Top10Row';
import { GenreRow } from '../components/Movies/GenreRow';
import { MovieDetailModal } from '../components/Movies/MovieDetailModal';
import {
  fetchTop10,
  fetchRecommendations,
  fetchRecent,
  fetchCategory,
  searchMovies as backendSearch,
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
  { key: 'anime', label: 'Anime about Friendship' },
  { key: 'drama', label: 'Critically Acclaimed TV Dramas' },
  { key: 'horror', label: 'Horror' },
  { key: 'comedy', label: 'Comedy' },
  { key: 'action', label: 'Action' },
  { key: 'romance', label: 'Romance' },
  { key: 'sci-fi', label: 'Sci-Fi' },
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
  const [activeTab, setActiveTab] = useState<'tv' | 'movies' | 'categories'>('movies');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [top10, setTop10] = useState<Movie[]>([]);
  const [top10Loading, setTop10Loading] = useState(true);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [genreMovies, setGenreMovies] = useState<
    Record<string, { movies: Movie[]; loading: boolean }>
  >({});
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  const handleTabChange = (tab: 'tv' | 'movies' | 'categories') => {
    setActiveTab(tab);
    if (tab === 'categories') {
      setTimeout(() => categoriesRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

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
        const d = await omdbSearch('action');
        return d.Response === 'True' && d.Search ? d.Search : [];
      }
    );
    setRecommendations(movies);
    setRecsLoading(false);
  }, []);

  const loadRecent = useCallback(async () => {
    setRecentLoading(true);
    const movies = await safeBackend(
      () => fetchRecent(),
      async () => {
        const d = await searchMoviesByYear(String(currentYear));
        return d.Response === 'True' && d.Search ? d.Search : [];
      }
    );
    setRecentMovies(movies);
    setRecentLoading(false);
  }, [currentYear]);

  const loadGenre = useCallback(async (genre: string) => {
    setGenreMovies((prev) => ({ ...prev, [genre]: { ...prev[genre], loading: true } }));
    const movies = await safeBackend(
      () => fetchCategory(genre),
      async () => {
        const d = await searchByGenre(genre);
        return d.Response === 'True' && d.Search ? d.Search : [];
      }
    );
    setGenreMovies((prev) => ({ ...prev, [genre]: { movies, loading: false } }));
  }, []);

  const loadSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const movies = await safeBackend(
      () => backendSearch(q),
      async () => {
        const d = await omdbSearch(q);
        return d.Response === 'True' && d.Search ? d.Search : [];
      }
    );
    setSearchResults(movies);
  }, []);

  useEffect(() => {
    loadTop10();
  }, [loadTop10]);
  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);
  useEffect(() => {
    loadRecent();
  }, [loadRecent]);
  useEffect(() => {
    ['anime', 'drama', 'horror', 'comedy', 'action', 'romance', 'sci-fi'].forEach(loadGenre);
  }, [loadGenre]);
  useEffect(() => {
    const t = setTimeout(() => loadSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery, loadSearch]);

  const handleMovieClick = async (movie: Movie) => {
    setDetailLoading(true);
    setSelectedMovie(movie);
    try {
      const data = await safeBackend(
        () => backendGetMovie(movie.imdbID),
        () => omdbGetMovie(movie.imdbID)
      );
      if (data?.Response === 'True') {
        setSelectedMovie(data as Movie);
      }
    } catch {
      setSelectedMovie(movie);
    } finally {
      setDetailLoading(false);
    }
  };

  const handlePlay = (movie: Movie) => openTrailer(movie.Title, movie.Year);

  const showSearch = searchOpen || searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-[#141414] pb-20 md:pb-8">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchFocus={() => setSearchOpen(true)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {showSearch && (
        <div className="fixed inset-0 z-40 bg-[#141414] p-4 pt-20">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="search"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-4 py-4 pl-12 bg-[#333] text-white rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-netput-red"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
              {searchQuery.length > 0 &&
                searchResults.map((m) => (
                  <div
                    key={m.imdbID}
                    onClick={() => {
                      handleMovieClick(m);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#333]">
                      <img
                        src={
                          m.Poster && m.Poster !== 'N/A'
                            ? m.Poster
                            : 'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster'
                        }
                        alt={m.Title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="mt-2 text-sm text-white font-medium line-clamp-2">{m.Title}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {!showSearch && (
        <main className="pb-8 -mt-16">
          <HeroSection recentMovies={recentMovies} onPlay={handlePlay} />

          <div ref={categoriesRef} className="max-w-7xl mx-auto px-4 md:px-8 -mt-8">
            <Top10Row
              movies={top10}
              loading={top10Loading}
              onMovieClick={handleMovieClick}
              onPlay={handlePlay}
            />
            <GenreRow
              title="We Think You'll Love These"
              movies={recommendations}
              loading={recsLoading}
              onMovieClick={handleMovieClick}
              onPlay={handlePlay}
              showRecentlyAdded
            />
            {myList.length > 0 && (
              <GenreRow
                title="My List"
                movies={myList}
                onMovieClick={handleMovieClick}
                onPlay={handlePlay}
              />
            )}
            <GenreRow
              title="Recently Released"
              movies={recentMovies}
              loading={recentLoading}
              onMovieClick={handleMovieClick}
              onPlay={handlePlay}
              showRecentlyAdded
            />
            {CATEGORY_SECTIONS.map(({ key, label }) => (
              <GenreRow
                key={key}
                title={label}
                movies={genreMovies[key]?.movies ?? []}
                loading={genreMovies[key]?.loading ?? true}
                onMovieClick={handleMovieClick}
                onPlay={handlePlay}
                showRecentlyAdded
              />
            ))}
          </div>
        </main>
      )}

      {selectedMovie && (
        <MovieDetailModal
          movie={
            detailLoading ? { ...selectedMovie, Plot: 'Loading...' } : selectedMovie
          }
          onClose={() => setSelectedMovie(null)}
          onPlay={() => handlePlay(selectedMovie)}
        />
      )}

      <BottomNav active="home" />
    </div>
  );
}
