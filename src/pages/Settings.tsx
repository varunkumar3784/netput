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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 hover:border-netput-red/30 transition-all cursor-pointer group shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Manage Profiles</h3>
                        </div>
                        <p className="text-gray-500 text-sm">Add or edit profiles for other viewers in your home.</p>
                    </div>

                    <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 hover:border-netput-red/30 transition-all cursor-pointer group shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Notifications</h3>
                        </div>
                        <p className="text-gray-500 text-sm">Control how you receive alerts about new releases.</p>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 shadow-2xl mb-8">
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-netput-red rounded-full" />
                        App Settings
                    </h2>
                    <div className="space-y-2">
                        {[
                            { label: 'Cellular Data Usage', value: 'Automatic', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                            { label: 'Download Quality', value: 'High', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
                            { label: 'Language', value: 'English (US)', icon: 'M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M12 21l-3-3m5-3l1-2M5 19l1-3a15.239 15.239 0 014.288-7.79' },
                            { label: 'Help Center & Support', value: 'Visit', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                        ].map((opt, i) => (
                            <div key={i} className="flex justify-between items-center py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] -mx-4 px-4 transition-colors rounded-xl cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={opt.icon} />
                                    </svg>
                                    <span className="font-bold text-gray-200">{opt.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 text-sm">{opt.value}</span>
                                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-netput-red/20 to-transparent rounded-3xl p-8 border border-white/5 flex items-center justify-between mb-12">
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1">Join our Community</h4>
                        <p className="text-sm text-gray-400">Stay updated with latest cinematic releases on Telegram.</p>
                    </div>
                    <button className="px-6 py-3 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform active:scale-95">Open Channel</button>
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
