'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
    title?: string;
}

export default function Header({ title = 'Dashboard' }: HeaderProps) {
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
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
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
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-surface-50 transition-colors disabled:opacity-50"
                            >
                                {loggingOut ? 'Signing out…' : 'Sign out'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
