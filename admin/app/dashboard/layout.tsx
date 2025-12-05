'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        router.push('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Analytics', path: '/dashboard/analytics', icon: '📈' },
        { name: 'Albums', path: '/dashboard/albums', icon: '🎵' },
        { name: 'Vidéos', path: '/dashboard/videos', icon: '🎬' },
        { name: 'Enseignements', path: '/dashboard/teachings', icon: '📖' },
        { name: 'Abonnés', path: '/dashboard/subscriptions', icon: '👥' },
        { name: 'Utilisateurs', path: '/dashboard/users', icon: '👤' },
        { name: 'Lives', path: '/dashboard/lives', icon: '📡' },
        { name: 'Paramètres', path: '/dashboard/settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700 sticky top-0 z-50">
                <h1 className="text-xl font-bold text-yellow-500">BONI MUSIK</h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-white p-2 focus:outline-none"
                >
                    {isSidebarOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div className="p-6 hidden md:block">
                    <h1 className="text-2xl font-bold text-yellow-500">BONI MUSIK</h1>
                    <p className="text-gray-400 text-sm mt-1">Admin Dashboard</p>
                </div>

                <nav className="mt-6 h-[calc(100vh-180px)] overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition ${pathname === item.path ? 'bg-gray-700 text-white border-l-4 border-yellow-500' : ''
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-64 p-6 bg-gray-800 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
                    >
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
