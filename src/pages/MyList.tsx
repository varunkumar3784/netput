import { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';
import { MovieDetailModal } from '../components/Movies/MovieDetailModal';
import { useMyList } from '../context/MyListContext';
import type { Movie } from '../types';
import { openTrailer } from '../utils/playTrailer';

export function MyList() {
    const { myList } = useMyList();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
    const handlePlay = (movie: Movie) => openTrailer(movie.Title, movie.Year);

    return (
        <div className="min-h-screen bg-[#141414] pb-20">
            <Header
                searchQuery=""
                onSearchChange={() => { }}
                onSearchFocus={() => { }}
                activeTab="categories"
                onTabChange={() => { }}
            />
            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24">
                <h1 className="text-3xl font-bold text-white mb-8">My List</h1>
                {myList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-white mb-2">Your list is empty</h2>
                        <p className="text-gray-400 max-w-sm">
                            Add movies and TV shows to your list to keep track of what you want to watch.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {myList.map((movie) => (
                            <div
                                key={movie.imdbID}
                                onClick={() => handleMovieClick(movie)}
                                className="cursor-pointer group relative aspect-[2/3] rounded-lg overflow-hidden bg-[#333] transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                            >
                                <img
                                    src={movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster'}
                                    alt={movie.Title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <p className="text-white text-xs font-bold truncate">{movie.Title}</p>
                                    <p className="text-gray-400 text-[10px]">{movie.Year}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            {selectedMovie && (
                <MovieDetailModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    onPlay={() => handlePlay(selectedMovie)}
                />
            )}
            <BottomNav active="home" />
        </div>
    );
}
