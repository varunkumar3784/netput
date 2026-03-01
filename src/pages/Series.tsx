import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { HeroSection } from '../components/Movies/HeroSection';
import { GenreRow } from '../components/Movies/GenreRow';
import { MovieDetailModal } from '../components/Movies/MovieDetailModal';
import {
    fetchSeries,
    fetchSeriesCategory,
} from '../services/backendApi';
import {
    searchSeries,
    searchSeriesByGenre,
} from '../services/api';
import type { Movie } from '../types';
import { openTrailer } from '../utils/playTrailer';

const SERIES_CATEGORIES = [
    { key: 'thriller', label: 'Action & Thriller Series' },
    { key: 'comedy', label: 'Comedy series' },
    { key: 'drama', label: 'TV Dramas' },
    { key: 'animation', label: 'Animation series' },
];

async function safeBackend<T>(fn: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch {
        return fallback();
    }
}

export function Series() {
    const [series, setSeries] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [genreSeries, setGenreSeries] = useState<
        Record<string, { movies: Movie[]; loading: boolean }>
    >({});
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const loadAllSeries = useCallback(async () => {
        setLoading(true);
        const data = await safeBackend(
            () => fetchSeries(),
            async () => {
                const d = await searchSeries('popular');
                return d.Response === 'True' && d.Search ? d.Search : [];
            }
        );
        setSeries(data);
        setLoading(false);
    }, []);

    const loadGenre = useCallback(async (genre: string) => {
        setGenreSeries((prev) => ({ ...prev, [genre]: { movies: [], loading: true } }));
        const data = await safeBackend(
            () => fetchSeriesCategory(genre),
            async () => {
                const d = await searchSeriesByGenre(genre);
                return d.Response === 'True' && d.Search ? d.Search : [];
            }
        );
        setGenreSeries((prev) => ({ ...prev, [genre]: { movies: data, loading: false } }));
    }, []);

    useEffect(() => {
        loadAllSeries();
        SERIES_CATEGORIES.forEach((c) => loadGenre(c.key));
    }, [loadAllSeries, loadGenre]);

    const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
    const handlePlay = (movie: Movie) => openTrailer(movie.Title, movie.Year);

    return (
        <div className="min-h-screen bg-[#141414] pb-20">
            <Header
                searchQuery=""
                onSearchChange={() => { }}
                onSearchFocus={() => { }}
                activeTab="tv"
                onTabChange={() => { }}
            />
            <main className="pb-8 -mt-16">
                <HeroSection recentMovies={series} onPlay={handlePlay} />
                <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8">
                    <GenreRow
                        title="Popular Series"
                        movies={series}
                        loading={loading}
                        onMovieClick={handleMovieClick}
                        onPlay={handlePlay}
                    />
                    {SERIES_CATEGORIES.map(({ key, label }) => (
                        <GenreRow
                            key={key}
                            title={label}
                            movies={genreSeries[key]?.movies ?? []}
                            loading={genreSeries[key]?.loading ?? true}
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
            <BottomNav active="series" />
        </div>
    );
}
