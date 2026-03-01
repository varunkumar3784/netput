import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { HeroSection } from '../components/Movies/HeroSection';
import { GenreRow } from '../components/Movies/GenreRow';
import { MovieDetailModal } from '../components/Movies/MovieDetailModal';
import {
    fetchRecent,
    fetchCategory,
} from '../services/backendApi';
import {
    searchMoviesByYear,
    searchByGenre,
} from '../services/api';
import type { Movie } from '../types';
import { openTrailer } from '../utils/playTrailer';

const MOVIE_CATEGORIES = [
    { key: 'action', label: 'Action Movies' },
    { key: 'comedy', label: 'Comedy Movies' },
    { key: 'horror', label: 'Horror Movies' },
    { key: 'sci-fi', label: 'Sci-Fi & Fantasy' },
];

async function safeBackend<T>(fn: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch {
        return fallback();
    }
}

export function Movies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [genreMovies, setGenreMovies] = useState<
        Record<string, { movies: Movie[]; loading: boolean }>
    >({});
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const loadAllMovies = useCallback(async () => {
        setLoading(true);
        const data = await safeBackend(
            () => fetchRecent(),
            async () => {
                const d = await searchMoviesByYear(new Date().getFullYear().toString());
                return d.Response === 'True' && d.Search ? d.Search : [];
            }
        );
        setMovies(data);
        setLoading(false);
    }, []);

    const loadGenre = useCallback(async (genre: string) => {
        setGenreMovies((prev) => ({ ...prev, [genre]: { movies: [], loading: true } }));
        const data = await safeBackend(
            () => fetchCategory(genre),
            async () => {
                const d = await searchByGenre(genre);
                return d.Response === 'True' && d.Search ? d.Search : [];
            }
        );
        setGenreMovies((prev) => ({ ...prev, [genre]: { movies: data, loading: false } }));
    }, []);

    useEffect(() => {
        loadAllMovies();
        MOVIE_CATEGORIES.forEach((c) => loadGenre(c.key));
    }, [loadAllMovies, loadGenre]);

    const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
    const handlePlay = (movie: Movie) => openTrailer(movie.Title, movie.Year);

    return (
        <div className="min-h-screen bg-[#141414] pb-20">
            <Header
                searchQuery=""
                onSearchChange={() => { }}
                onSearchFocus={() => { }}
                activeTab="movies"
                onTabChange={() => { }}
            />
            <main className="pb-8 -mt-16">
                <HeroSection recentMovies={movies} onPlay={handlePlay} />
                <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8">
                    <GenreRow
                        title="Trending Movies"
                        movies={movies}
                        loading={loading}
                        onMovieClick={handleMovieClick}
                        onPlay={handlePlay}
                    />
                    {MOVIE_CATEGORIES.map(({ key, label }) => (
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
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    onPlay={() => handlePlay(selectedMovie)}
                />
            )}
            <BottomNav active="movies" />
        </div>
    );
}
