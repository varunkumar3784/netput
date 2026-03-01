import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { SearchOverlay } from '../components/Movies/SearchOverlay';
import { MovieDetailModal } from '../components/Movies/MovieDetailModal';
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

export function Settings() {
    const { user, logout } = useAuth();
    const [searchOpen, setSearchOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
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
        <div className="min-h-screen bg-[#141414] text-white pb-20">
            <Header activeTab="categories" onSearchTrigger={() => setSearchOpen(true)} />

            <main className="max-w-4xl mx-auto px-4 pt-32 animate-fade-in">
                <h1 className="text-5xl font-black mb-12 tracking-tight">Account Settings</h1>

                <div className="bg-[#1a1a1a] rounded-3xl p-10 mb-8 shadow-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-20 pointer-events-none">
                        <svg className="w-40 h-40 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                        </svg>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10 relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-netput-red to-red-800 rounded-full flex items-center justify-center text-4xl font-black shadow-glow border-4 border-white/10 shrink-0">
                            {user?.email?.[0].toUpperCase() ?? 'U'}
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-1">Your Account</p>
                            <p className="text-3xl font-black text-white">{user?.email}</p>
                            <p className="text-netput-red text-sm font-medium mt-1">Premium Member</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full py-5 bg-netput-red text-white font-black text-lg rounded-2xl hover:bg-red-700 transition-all shadow-xl hover:shadow-red-900/40 transform hover:-translate-y-1 active:scale-95"
                    >
                        Sign Out of Netput
                    </button>
                </div>

                <div className="bg-[#1a1a1a] rounded-3xl p-10 border border-white/5 shadow-2xl">
                    <h2 className="text-2xl font-black mb-6">Application Details</h2>
                    <div className="space-y-6 text-gray-400">
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                            <span className="font-bold">Version</span>
                            <span className="text-white font-mono">2.0.4-premium</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="font-bold">Streaming Quality</span>
                            <span className="text-green-500 font-bold uppercase tracking-widest text-xs bg-green-500/10 px-3 py-1 rounded">Ultra HD 4K</span>
                        </div>
                    </div>
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

            <BottomNav active="settings" />
        </div>
    );
}
