'use client';

import { useEffect, useState } from 'react';

interface Stat {
    label: string;
    value: number;
    icon: string;
    color: string;
}

interface ActivityLog {
    id: number;
    action: string;
    target_type: string;
    target_id: string | null;
    details: string | null;
    created_at: string;
    admin: { email: string };
}

function getActionDotColor(action: string) {
    if (action.includes('CREATE') || action.includes('REGISTER')) return 'bg-emerald-500';
    if (action.includes('BLOCK') || action.includes('DELETE')) return 'bg-red-500';
    if (action.includes('UPDATE') || action.includes('LINK')) return 'bg-blue-500';
    if (action.includes('UNLINK')) return 'bg-amber-500';
    return 'bg-gray-400';
}

function getActionLabel(action: string) {
    const map: Record<string, string> = {
        'CREATE_USER': 'User created',
        'REGISTER_CARD': 'Card registered',
        'LINK_CARD': 'Card linked',
        'UNLINK_CARD': 'Card unlinked',
        'BLOCK_CARD': 'Card blocked',
        'UPDATE_CARD': 'Card updated',
        'DELETE_CARD': 'Card deleted',
    };
    return map[action] || action.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());
}

function getActionDetail(log: ActivityLog) {
    const parts: string[] = [];
    if (log.target_type) parts.push(log.target_type);
    if (log.target_id) parts.push(`#${log.target_id}`);
    parts.push(`by ${log.admin?.email || 'Unknown'}`);
    return parts.join(' · ');
}

function relativeTime(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                if (data.stats) setStats(data.stats);
                setLoading(false);
            });

        fetch('/api/admin/logs?page=1&limit=3')
            .then(res => res.json())
            .then(data => {
                if (data.logs) setActivities(data.logs);
                setActivitiesLoading(false);
            })
            .catch(() => setActivitiesLoading(false));
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Users', icon: 'users', color: 'blue' },
                        { label: 'Active Profiles', icon: 'profile', color: 'purple' },
                        { label: 'Total Cards', icon: 'card', color: 'green' },
                        { label: 'Unassigned Cards', icon: 'inventory', color: 'yellow' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-xl ${colorMap[stat.color]}`}>
                                    {iconMap[stat.icon]}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                                <div className="h-8 bg-gray-100 rounded w-16 mt-2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-200 shadow transition-all hover:shadow-md">
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
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        <a
                            href="/admin/logs"
                            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                        >
                            View All →
                        </a>
                    </div>
                    <div className="space-y-5">
                        {activitiesLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-start gap-4 animate-pulse">
                                    <div className="w-2 h-2 rounded-full bg-gray-200 mt-2" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 w-32 bg-gray-100 rounded" />
                                        <div className="h-3 w-48 bg-gray-50 rounded" />
                                    </div>
                                </div>
                            ))
                        ) : activities.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-400">No activity recorded yet.</p>
                            </div>
                        ) : (
                            activities.map((log) => (
                                <div key={log.id} className="flex items-start gap-4 group">
                                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getActionDotColor(log.action)}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[15px] text-gray-900 font-medium">{getActionLabel(log.action)}</p>
                                        <p className="text-sm text-gray-400 mt-0.5 truncate">{getActionDetail(log)}</p>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap mt-1">{relativeTime(log.created_at)}</span>
                                </div>
                            ))
                        )}
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
