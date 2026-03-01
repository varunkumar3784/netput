import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Layout/Header';
import { BottomNav } from '../components/Layout/BottomNav';

export function Settings() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#141414] text-white pb-20">
            <Header
                searchQuery=""
                onSearchChange={() => { }}
                onSearchFocus={() => { }}
                activeTab="categories"
                onTabChange={() => { }}
            />
            <main className="max-w-4xl mx-auto px-4 pt-24">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>

                <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-netput-red rounded-full flex items-center justify-center text-2xl font-bold">
                            {user?.email?.[0].toUpperCase() ?? 'U'}
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Account</p>
                            <p className="text-xl font-medium">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full py-3 bg-netput-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Sign Out of Netput
                    </button>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-6">
                    <h2 className="text-lg font-bold mb-4">About</h2>
                    <div className="space-y-4 text-gray-400">
                        <p>Version: 1.0.0</p>
                        <p>Netput is a streaming UI concept built with React and OMDb.</p>
                    </div>
                </div>
            </main>
            <BottomNav active="settings" />
        </div>
    );
}
