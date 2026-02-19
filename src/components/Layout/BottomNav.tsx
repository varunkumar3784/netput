import { Link } from 'react-router-dom';

type NavItem = 'home' | 'series' | 'movies' | 'settings';

interface BottomNavProps {
  active: NavItem;
}

export function BottomNav({ active }: BottomNavProps) {
  const linkClass = (id: NavItem) =>
    `flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
      active === id ? 'text-netput-red' : 'text-gray-500 hover:text-white'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0d] border-t border-white/10">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        <Link to="/dashboard" className={linkClass('home')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </Link>
        <button type="button" className={linkClass('series')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium">Series</span>
        </button>
        <Link to="/dashboard" className={linkClass('movies')}>
          <span className="text-2xl font-bold text-netput-red">N</span>
          <span className="text-xs font-medium">Movies</span>
        </Link>
        <button type="button" className={linkClass('settings')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
}
