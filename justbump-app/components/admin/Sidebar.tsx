'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
    {
        label: 'Users',
        href: '/admin/users',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    },
    {
        label: 'Calling Cards',
        href: '/admin/calling-cards',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
        ),
    },
    {
        label: 'Physical Cards',
        href: '/admin/physical-cards',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
        ),
    },
    {
        label: 'Activity Logs',
        href: '/admin/logs',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
        ),
    },
];

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    onClose: () => void;
    onCollapseToggle: () => void;
}

export default function Sidebar({ isOpen, isCollapsed, onClose, onCollapseToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 flex flex-col z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${isCollapsed ? 'w-64 lg:w-20' : 'w-64'}`}
            >
                {/* Brand */}
                <div className={`h-16 flex items-center border-b border-gray-100 transition-all duration-300 relative ${isCollapsed ? 'px-4 lg:justify-center' : 'px-6'}`}>
                    <Link href="/admin" className="flex items-center justify-center py-2">
                        <img
                            src="/jblogo.png"
                            alt="JustBump Logo"
                            className="h-10 w-auto object-contain transition-all duration-300"
                        />
                    </Link>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={onCollapseToggle}
                        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-100 rounded-full items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-200 shadow-sm transition-all duration-300 z-50"
                        style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                        </svg>
                    </button>
                </div>

                {/* Nav */}
                <nav className={`flex-1 py-4 space-y-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'px-2 lg:px-4' : 'px-3'}`}>
                    {navItems.map((item) => {
                        const isActive =
                            item.href === '/admin'
                                ? pathname === '/admin'
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()}
                                className={`flex items-center rounded-lg text-sm font-medium transition-all duration-300 ${isCollapsed ? 'lg:justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
                                    } ${isActive
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:bg-surface-100 hover:text-gray-900'
                                    }`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <div className="flex-shrink-0">{item.icon}</div>
                                <span className={`transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 text-center overflow-hidden">
                    <p className={`text-xs text-gray-400 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                        Admin Panel v1.0
                    </p>
                    {isCollapsed && (
                        <div className="hidden lg:block text-[10px] font-bold text-gray-400">v1.0</div>
                    )}
                </div>
            </aside>
        </>
    );
}
