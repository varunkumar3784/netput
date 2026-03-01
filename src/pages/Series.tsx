import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { HeroSection } from '../components/Movies/HeroSection';
import { GenreRow } from '../components/Movies/GenreRow';
import { MovieDetailModal } from '../components/Movies/MovieDetailModal';
import { SearchOverlay } from '../components/Movies/SearchOverlay';
import {
    fetchSeries,
    fetchSeriesCategory,
    getMovieById as backendGetMovie
} from '../services/backendApi';
import {
    searchSeries,
    searchSeriesByGenre,
    getMovieById as omdbGetMovie
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
    const [searchOpen, setSearchOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeGenre, setActiveGenre] = useState('tv');

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

    // Handle initial hash scroll and hash changes
    useEffect(() => {
        const handleHash = () => {
            if (window.location.hash) {
                const hash = window.location.hash.substring(1);
                setActiveGenre(hash);
                const element = document.getElementById(hash);
                if (element) {
                    const offset = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                setActiveGenre('tv');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        window.addEventListener('hashchange', handleHash);
        if (window.location.hash) handleHash();

        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

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
                activeTab={activeGenre}
                onSearchTrigger={() => setSearchOpen(true)}
                customPills={[
                    { id: 'tv', label: 'All Series', to: '/series' },
                    ...SERIES_CATEGORIES.map(c => ({
                        id: c.key,
                        label: c.label.replace(' series', '').replace(' Series', ''),
                        to: `/series#${c.key}`
                    }))
                ]}
            />

            <main className="pb-8 -mt-20">
                <HeroSection recentMovies={series.slice(0, 5)} onPlay={handlePlay} />
                <div className="max-w-7xl mx-auto px-4 md:px-12 -mt-10 relative z-10">
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
                            id={key}
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
                    movie={detailLoading ? { ...selectedMovie, Plot: 'Loading...' } : selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    onPlay={() => handlePlay(selectedMovie)}
                />
            )}

            <SearchOverlay
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                onMovieClick={handleMovieClick}
            />

            <BottomNav active="series" />
        </div>
    );
}
