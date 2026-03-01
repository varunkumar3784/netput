import { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { MovieDetailModal } from '../components/Movies/MovieDetailModal';
import { MovieCard } from '../components/Movies/MovieCard';
import { SearchOverlay } from '../components/Movies/SearchOverlay';
import { useMyList } from '../context/MyListContext';
import { getMovieById as backendGetMovie } from '../services/backendApi';
import { getMovieById as omdbGetMovie } from '../services/api';
import type { Movie } from '../types';
import { openTrailer } from '../utils/playTrailer';

async function safeBackend<T>(fn: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch {
        return fallback();
    }
}

export function MyList() {
    const { myList } = useMyList();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

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
        <div className="min-h-screen bg-[#141414] pb-20">
            <Header activeTab="mylist" onSearchTrigger={() => setSearchOpen(true)} />

            <main className="max-w-7xl mx-auto px-4 md:px-12 pt-32">
                <h1 className="text-4xl font-black text-white mb-12 flex items-center gap-4">
                    <span className="w-2 h-10 bg-netput-red rounded-full shadow-glow" />
                    My Creative List
                </h1>

                {myList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-2xl">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Your list is looking empty</h2>
                        <p className="text-gray-500 max-w-sm">
                            Discover movies and TV shows and add them here to create your own cinematic collection.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                        {myList.map((movie) => (
                            <MovieCard
                                key={movie.imdbID}
                                movie={movie}
                                onClick={() => handleMovieClick(movie)}
                                onPlay={handlePlay}
                            />
                        ))}
                    </div>
                )}
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

            <BottomNav active="home" />
        </div>
    );
}
