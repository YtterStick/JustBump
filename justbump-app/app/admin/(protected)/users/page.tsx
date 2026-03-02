'use client';

import { useEffect, useState } from 'react';

interface User {
    id: number;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    last_login: string | null;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => {
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' ? user.is_active : !user.is_active);
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[240px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by email..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 sm:text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</span>
                    <select
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                    <select
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p className="text-gray-900 font-medium">No users found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-surface-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-surface-25 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
