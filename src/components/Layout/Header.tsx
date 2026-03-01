import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  activeTab?: 'home' | 'tv' | 'movies' | 'categories' | 'mylist' | string;
  onSearchTrigger?: () => void;
  customPills?: { id: string; label: string; to: string }[];
}

export function Header({
  activeTab = 'home',
  onSearchTrigger,
  customPills
}: HeaderProps) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const defaultPills = [
    { id: 'home', label: 'All', to: '/dashboard' },
    { id: 'tv', label: 'TV Shows', to: '/series' },
    { id: 'movies', label: 'Movies', to: '/movies' },
    { id: 'mylist', label: 'My List', to: '/mylist' },
  ];

  const pills = customPills || defaultPills;

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-black/90 via-black/40 to-transparent backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 md:px-12 h-20">
        <div className="flex items-center gap-6 md:gap-10 flex-1">
          <Link to="/dashboard" className="flex items-center shrink-0 group transition-all transform hover:scale-110">
            <span className="flex items-center gap-1.5">
              <span className="text-4xl font-black text-netput-red drop-shadow-red transition-all group-hover:drop-shadow-glow">N</span>
              <span className="text-2xl font-black text-white hidden sm:inline tracking-tighter">etput</span>
            </span>
          </Link>

          <div className="flex-1 max-w-lg">
            {/* Desktop Search */}
            <div
              onClick={onSearchTrigger}
              className="hidden md:block relative cursor-pointer group"
            >
              <div className="w-full px-5 py-3.5 bg-white/5 text-gray-400 rounded-2xl border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all flex items-center gap-4">
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium">Search for movies, series...</span>
              </div>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={onSearchTrigger}
              className="md:hidden p-2.5 bg-white/5 rounded-full border border-white/10 text-gray-400 hover:text-white transition-all shadow-lg backdrop-blur-md"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide ml-2">
            {pills.map((pill) => (
              <Link
                key={pill.id}
                to={pill.to}
                onClick={(e) => {
                  if (pill.to.includes('#')) {
                    const [path, hash] = pill.to.split('#');
                    if (path === window.location.pathname || (path === '/dashboard' && window.location.pathname === '/')) {
                      e.preventDefault();
                      const element = document.getElementById(hash);
                      if (element) {
                        const offset = 100; // Account for sticky header
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }
                  }
                }}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeTab === pill.id
                  ? 'bg-netput-red text-white shadow-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                {pill.label}
              </Link>
            ))}
          </nav>
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
