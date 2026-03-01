import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchFocus?: () => void;
  activeTab?: 'tv' | 'movies' | 'categories' | 'mylist';
  onTabChange?: (tab: 'tv' | 'movies' | 'categories' | 'mylist') => void;
}

export function Header({
  searchQuery = '',
  onSearchChange,
  onSearchFocus,
  activeTab = 'movies',
  onTabChange,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const pills = [
    { id: 'tv' as const, label: 'TV Shows' },
    { id: 'movies' as const, label: 'Movies' },
    { id: 'mylist' as const, label: 'My List' },
    { id: 'categories' as const, label: 'Categories' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-black/80 to-transparent">
      <div className="flex items-center justify-between px-4 md:px-8 h-16">
        <div className="flex items-center gap-4 md:gap-6 flex-1">
          <Link to="/dashboard" className="flex items-center shrink-0">
            <span className="flex items-center gap-1">
              <span className="text-3xl font-black text-netput-red">N</span>
              <span className="text-xl font-bold text-white hidden sm:inline">etput</span>
            </span>
          </Link>
          {onSearchChange && (
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={onSearchFocus}
                  className="w-full px-4 py-2 pl-10 bg-[#333] text-white rounded-lg placeholder-gray-500 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-netput-red"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}
          {onTabChange && (
            <nav className="flex items-center gap-1">
              {pills.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => onTabChange(pill.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === pill.id
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {pill.label}
                </button>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="w-9 h-9 rounded bg-netput-red flex items-center justify-center text-white font-bold hover:bg-netput-red-hover transition-colors"
              aria-label="Profile"
            >
              {user?.email?.charAt(0).toUpperCase() || '?'}
            </button>
            {showProfile && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 mt-2 w-56 py-2 bg-[#1a1a1a] rounded-lg shadow-xl z-50 border border-white/10">
                  <p className="px-4 py-2 text-sm text-gray-400 truncate">
                    {user?.email}
                  </p>
                  <button
                    onClick={() => {
                      logout();
                      setShowProfile(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
