import { useState, useEffect, useCallback } from 'react';
import { searchMovies } from '../../services/api';
import type { Movie } from '../../types';

export function SearchOverlay({ isOpen, onClose, onMovieClick }: { isOpen: boolean; onClose: () => void; onMovieClick: (movie: Movie) => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const data = await searchMovies(q);
            setResults(data.Response === 'True' && data.Search ? data.Search : []);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => handleSearch(query), 500);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl animate-fade-in flex flex-col items-center pt-24 px-4">
            <button
                onClick={onClose}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
            >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="w-full max-w-4xl">
                <div className="relative group">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search for movies, TV shows, actors..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent border-b-4 border-white/20 text-4xl md:text-6xl font-black text-white focus:outline-none focus:border-netput-red transition-colors pb-4 placeholder:text-white/10"
                    />
                    <div className="absolute right-0 bottom-6">
                        {loading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-netput-red border-t-transparent" />
                        ) : (
                            <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </div>
                </div>

                <div className="mt-12 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
                    {query && !loading && results.length === 0 && (
                        <p className="text-2xl text-gray-500 text-center py-20">No results found for "{query}"</p>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {results.map((movie) => (
                            <div
                                key={movie.imdbID}
                                onClick={() => {
                                    onMovieClick(movie);
                                    onClose();
                                }}
                                className="cursor-pointer group animate-scale-in"
                            >
                                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/10 transition-all group-hover:border-netput-red group-hover:scale-105 shadow-2xl relative">
                                    <img
                                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster'}
                                        alt={movie.Title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <p className="text-white font-bold text-sm leading-tight">{movie.Title}</p>
                                        <p className="text-gray-400 text-xs mt-1">{movie.Year}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
