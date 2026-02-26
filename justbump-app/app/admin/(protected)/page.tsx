'use client';

import { useEffect, useState } from 'react';

interface Stat {
    label: string;
    value: number;
    icon: string;
    color: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                if (data.stats) setStats(data.stats);
                setLoading(false);
            });
    }, []);

    const iconMap: Record<string, React.ReactNode> = {
        users: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        profile: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>,
        card: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        inventory: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    };

    const colorMap: Record<string, string> = {
        blue: 'text-blue-600 bg-blue-50',
        purple: 'text-purple-600 bg-purple-50',
        green: 'text-green-600 bg-green-50',
        yellow: 'text-yellow-600 bg-yellow-50',
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-100 rounded-2xl border border-gray-100"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-xl ${colorMap[stat.color]}`}>
                                    {iconMap[stat.icon]}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-900 font-medium">New card registered</p>
                                <p className="text-xs text-gray-400 mt-0.5">Physical card UID 055 added to inventory</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-900 font-medium">User profile updated</p>
                                <p className="text-xs text-gray-400 mt-0.5">Admin updated settings for admin@justbump.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-brand-600 p-8 rounded-2xl shadow-lg relative overflow-hidden text-white">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold">Quick Tips</h3>
                        <p className="mt-4 text-brand-100 text-sm leading-relaxed">
                            Remember to verify physical cards before shipping them out to customers.
                            You can assign cards to profiles in the inventory tab.
                        </p>
                        <button
                            onClick={() => window.location.href = '/admin/physical-cards'}
                            className="mt-8 bg-white text-brand-600 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-50 transition-colors"
                        >
                            Manage Cards
                        </button>
                    </div>
                    <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-brand-500 rounded-full blur-2xl opacity-50"></div>
                </div>
            </div>
        </div>
    );
}
