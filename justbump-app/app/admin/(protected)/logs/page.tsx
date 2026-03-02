'use client';

import { useEffect, useState } from 'react';
import Pagination from '../../../../components/admin/Pagination';

interface AdminLog {
    id: number;
    admin_id: number;
    admin: {
        email: string;
    };
    action: string;
    target_type: string;
    target_id: string | null;
    details: string | null;
    ip_address: string | null;
    created_at: string;
}

const PAGE_SIZE = 10;

export default function LogsPage() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [targetFilter, setTargetFilter] = useState('all');

    const fetchLogs = async (p: number) => {
        setLoading(true);
        try {
            let url = `/api/admin/logs?page=${p}&limit=${PAGE_SIZE}`;
            if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
            if (actionFilter !== 'all') url += `&action=${encodeURIComponent(actionFilter)}`;
            if (targetFilter !== 'all') url += `&target=${encodeURIComponent(targetFilter)}`;

            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                setLogs(data.logs);
                setTotalLogs(data.pagination.total);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [searchTerm, actionFilter, targetFilter]);

    useEffect(() => {
        fetchLogs(page);
    }, [page, searchTerm, actionFilter, targetFilter]);

    const getActionColor = (action: string) => {
        if (action.includes('CREATE')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (action.includes('BLOCK') || action.includes('DELETE')) return 'bg-red-50 text-red-600 border-red-100';
        if (action.includes('UPDATE') || action.includes('LINK')) return 'bg-blue-50 text-blue-600 border-blue-100';
        return 'bg-gray-50 text-gray-600 border-gray-100';
    };

    const formatDetails = (details: string | null) => {
        if (!details) return <span className="text-gray-300 italic">No extra details</span>;
        try {
            const parsed = JSON.parse(details);
            const keys = Object.keys(parsed);
            if (keys.length === 0) return <span className="text-gray-300 italic">Empty details</span>;

            return (
                <div className="flex flex-wrap gap-2 max-w-md">
                    {keys.map((key) => {
                        const val = parsed[key];
                        const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);

                        return (
                            <div key={key} className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] animate-in fade-in zoom-in-95 duration-200">
                                <span className="font-bold text-gray-400 uppercase tracking-tighter">{key.replace(/_/g, ' ')}:</span>
                                <span className="font-semibold text-gray-600 truncate max-w-[120px]" title={displayVal}>
                                    {displayVal}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        } catch (e) {
            return <span className="text-xs text-gray-500 font-medium">{details}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900">Admin Activity Logs</h2>
                <p className="text-sm text-gray-400 mt-1">Audit trail of all administrative actions performed in the system.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 min-w-[240px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 sm:text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Action</span>
                    <select
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                    >
                        <option value="all">All Actions</option>
                        <option value="CREATE_USER">Create User</option>
                        <option value="REGISTER_CARD">Register Card</option>
                        <option value="LINK_CARD">Link Card</option>
                        <option value="UNLINK_CARD">Unlink Card</option>
                        <option value="BLOCK_CARD">Block Card</option>
                        <option value="UPDATE_CARD">Update Card</option>
                        <option value="DELETE_CARD">Delete Card</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target</span>
                    <select
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                        value={targetFilter}
                        onChange={(e) => setTargetFilter(e.target.value)}
                    >
                        <option value="all">All Targets</option>
                        <option value="User">User</option>
                        <option value="Card">Card</option>
                        <option value="CallingCard">Calling Card</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading && logs.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <svg className="w-8 h-8 text-gray-200 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p className="text-sm font-medium text-gray-400">Loading activity history...</p>
                        </div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <p className="text-gray-900 font-medium text-lg">No activity logs yet</p>
                        <p className="text-sm text-gray-400 mt-1">Actions performed by admins will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-surface-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Admin</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-surface-25/50 transition-colors group">
                                        <td className="px-6 py-4 text-xs text-gray-500 font-mono whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{log.admin.email}</div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Admin ID: {log.admin_id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-semibold text-gray-700">{log.target_type}</div>
                                            {log.target_id && (
                                                <code className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{log.target_id}</code>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDetails(log.details)}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                                            {log.ip_address || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!loading && (
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(totalLogs / PAGE_SIZE)}
                    onPageChange={setPage}
                    totalItems={totalLogs}
                    itemsPerPage={PAGE_SIZE}
                />
            )}
        </div>
    );
}
