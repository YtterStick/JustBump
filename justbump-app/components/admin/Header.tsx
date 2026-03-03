'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
    title?: string;
    onMenuClick?: () => void;
}

export default function Header({ title = 'Dashboard', onMenuClick }: HeaderProps) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
        setLoggingOut(true);
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch {
            setLoggingOut(false);
        }
    }

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                {/* Mobile Toggle */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-600 lg:hidden"
                    aria-label="Open sidebar"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>


                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>

            {/* User menu */}
            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-surface-100 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <span>Admin</span>
                    <svg
                        className={`w-4 h-4 transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                {showMenu && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowMenu(false)}
                        />
                        {/* Dropdown */}
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Account</p>
                                <p className="text-sm font-medium text-gray-900 truncate">jbadmin@justbump.com</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 group font-medium"
                            >
                                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>
                                </div>
                                {loggingOut ? 'Signing out…' : 'Sign out'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
