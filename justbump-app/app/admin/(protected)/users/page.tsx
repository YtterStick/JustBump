'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Portal from '../../../../components/admin/Portal';
import Pagination from '../../../../components/admin/Pagination';

interface LinkedCard {
    card_id: number;
    card_uid: string;
    card_type: string;
}

interface User {
    id: number;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    last_login: string | null;
    calling_card: {
        id: number;
        physical_cards: LinkedCard[];
    } | null;
}

const PAGE_SIZE = 5;

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLinkCardModalOpen, setIsLinkCardModalOpen] = useState(false);
    const [isUnlinkCardModalOpen, setIsUnlinkCardModalOpen] = useState(false);
    const [selectedUserForLink, setSelectedUserForLink] = useState<{ id: number; email: string } | null>(null);
    const [selectedUserForUnlink, setSelectedUserForUnlink] = useState<{ id: number; email: string; cards: LinkedCard[] } | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => {
                const fetchedUsers = Array.isArray(data) ? data : [];
                setUsers(fetchedUsers);
                setLoading(false);

                const unlinkUserId = searchParams.get('unlink_user_id');
                if (unlinkUserId) {
                    const userToUnlink = fetchedUsers.find(u => u.id === parseInt(unlinkUserId));
                    if (userToUnlink && userToUnlink.calling_card?.physical_cards.length) {
                        setSelectedUserForUnlink({
                            id: userToUnlink.id,
                            email: userToUnlink.email,
                            cards: userToUnlink.calling_card.physical_cards,
                        });
                        setIsUnlinkCardModalOpen(true);

                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('unlink_user_id');
                        router.replace(`/admin/users${params.toString() ? `?${params.toString()}` : ''}`);
                    }
                }
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' ? user.is_active : !user.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => { setPage(1); }, [searchTerm, roleFilter, statusFilter]);

    const handleUserRegistered = (newUser: { id: number; email: string; role: string }) => {
        fetchUsers();
        if (newUser.role === 'User') {
            setSelectedUserForLink({ id: newUser.id, email: newUser.email });
            setIsLinkCardModalOpen(true);
        }
    };

    const getUserLinkedCards = (user: User): LinkedCard[] => {
        return user.calling_card?.physical_cards || [];
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
                    <p className="text-sm text-gray-400 mt-1">Manage admin and user accounts and their physical cards.</p>
                </div>
                <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Register Account
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
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
                    <div className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-3">
                            <svg className="w-8 h-8 text-gray-200 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p className="text-sm font-medium">Loading users...</p>
                        </div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-900 font-medium text-lg">No users found</p>
                        <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Try adjusting your search or register a new user to populate this list.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-surface-25/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono tracking-tight">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role === 'User' && (
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUserForLink({ id: user.id, email: user.email });
                                                            setIsLinkCardModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
                                                        title="Link Card"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                        </svg>
                                                        Link Card
                                                    </button>
                                                    {getUserLinkedCards(user).length > 0 && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUserForUnlink({
                                                                    id: user.id,
                                                                    email: user.email,
                                                                    cards: getUserLinkedCards(user),
                                                                });
                                                                setIsUnlinkCardModalOpen(true);
                                                            }}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100"
                                                            title="Unlink Card"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                            </svg>
                                                            Unlink
                                                        </button>
                                                    )}
                                                </div>
                                            )}
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
                    totalPages={totalPages}
                    onPageChange={setPage}
                    totalItems={filteredUsers.length}
                    itemsPerPage={PAGE_SIZE}
                />
            )}

            {/* Modals */}
            {isRegisterModalOpen && (
                <RegisterUserModal
                    onClose={() => setIsRegisterModalOpen(false)}
                    onSuccess={handleUserRegistered}
                />
            )}

            {isLinkCardModalOpen && selectedUserForLink && (
                <LinkCardModal
                    user={selectedUserForLink}
                    onClose={() => {
                        setIsLinkCardModalOpen(false);
                        setSelectedUserForLink(null);
                    }}
                    onLinked={fetchUsers}
                />
            )}

            {isUnlinkCardModalOpen && selectedUserForUnlink && (
                <UnlinkCardModal
                    user={selectedUserForUnlink}
                    onClose={() => {
                        setIsUnlinkCardModalOpen(false);
                        setSelectedUserForUnlink(null);
                    }}
                    onUnlinked={fetchUsers}
                />
            )}
        </div>
    );
}

function RegisterUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (user: any) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            onSuccess(data);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Register Account</h3>
                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">New credentials</p>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all placeholder:text-gray-300"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all placeholder:text-gray-300"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Account Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['User', 'Admin'].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${role === r
                                                ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200'
                                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl shadow-gray-200 hover:shadow-gray-300 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : 'Register Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Portal>
    );
}

function LinkCardModal({ user, onClose, onLinked }: { user: { id: number; email: string }; onClose: () => void; onLinked: () => void }) {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const parsed = useMemo(() => {
        const val = inputValue.trim();
        if (!val) return { mode: 'empty', uids: [] };

        const rangeMatch = val.match(/^(\d+)\s*-\s*(\d+)$/);
        if (rangeMatch) {
            const startNum = parseInt(rangeMatch[1], 10);
            const endNum = parseInt(rangeMatch[2], 10);
            const maxLen = Math.max(rangeMatch[1].length, rangeMatch[2].length, 4);

            if (endNum < startNum) return { mode: 'invalid', message: 'End must be ≥ Start', uids: [] };
            if (endNum - startNum > 49) return { mode: 'invalid', message: 'Max 50 cards at once', uids: [] };

            const uids = [];
            for (let i = startNum; i <= endNum; i++) {
                uids.push(String(i).padStart(maxLen, '0'));
            }
            return { mode: 'batch', uids };
        }

        if (/^\d+$/.test(val)) {
            return { mode: 'single', uids: [val.padStart(4, '0')] };
        }

        return { mode: 'invalid', message: 'Enter a number or range (e.g. 0022-0024)', uids: [] };
    }, [inputValue]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (parsed.mode === 'invalid' || parsed.uids.length === 0) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/physical-cards/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    card_uids: parsed.uids,
                    user_id: user.id
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Linking failed');

            setSuccess(true);
            onLinked();
            setTimeout(onClose, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Portal>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                    {success ? (
                        <div className="p-12 text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Cards Linked!</h3>
                            <p className="text-sm text-gray-400 mt-2">{parsed.uids.length} physical card(s) have been successfully assigned to {user.email}.</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b border-gray-100 bg-brand-50/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="px-2 py-1 bg-brand-100 text-brand-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                        Batch Linking
                                    </div>
                                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Link Physical Cards</h3>
                                <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                                    Assigning to <span className="font-semibold text-gray-700">{user.email}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Card UID or Range</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            className={`w-full px-4 py-4 rounded-2xl border-2 text-lg font-mono tracking-widest focus:outline-none transition-all placeholder:text-gray-200 ${parsed.mode === 'invalid'
                                                ? 'border-red-100 bg-red-50/30'
                                                : 'border-gray-100 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500'
                                                }`}
                                            placeholder="XXXX or XXXX-XXXX"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <svg className={`w-6 h-6 transition-colors ${parsed.mode === 'invalid' ? 'text-red-300' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {parsed.mode === 'invalid' ? (
                                        <p className="mt-2 text-[10px] text-red-500 font-bold italic animate-in slide-in-from-left-1">{parsed.message}</p>
                                    ) : (
                                        <p className="mt-2 text-[10px] text-gray-400 italic">Enter a single UID (e.g. 0001) or a range (e.g. 0022-0024).</p>
                                    )}
                                </div>

                                {parsed.uids.length > 0 && parsed.mode !== 'invalid' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Preview ({parsed.uids.length} Card{parsed.uids.length > 1 ? 's' : ''})
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 scrollbar-hide">
                                            {parsed.uids.map(uid => (
                                                <span key={uid} className="px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-mono font-bold text-gray-600 shadow-sm">
                                                    {uid}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-3 animate-head-shake">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading || parsed.mode === 'invalid' || parsed.uids.length === 0}
                                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-100 active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Linking...
                                            </span>
                                        ) : `Link ${parsed.uids.length} Card${parsed.uids.length !== 1 ? 's' : ''}`}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full py-4 bg-white text-gray-500 rounded-2xl text-sm font-bold hover:text-gray-700 transition-all border border-gray-100"
                                    >
                                        Skip for Now
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </Portal>
    );
}

function UnlinkCardModal({ user, onClose, onUnlinked }: {
    user: { id: number; email: string; cards: LinkedCard[] };
    onClose: () => void;
    onUnlinked: () => void;
}) {
    const [selectedCardId, setSelectedCardId] = useState<number | null>(
        user.cards.length === 1 ? user.cards[0].card_id : null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUnlink = async () => {
        if (!selectedCardId) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/physical-cards', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ card_id: selectedCardId, calling_card_id: null }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to unlink card');
            }

            onUnlinked();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Portal>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Unlink Card</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                            </div>
                            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                                {user.cards.length === 1 ? 'Linked Card' : 'Select Card to Unlink'}
                            </label>
                            <div className="space-y-2">
                                {user.cards.map(card => (
                                    <label
                                        key={card.card_id}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selectedCardId === card.card_id
                                            ? 'border-amber-300 bg-amber-50/50'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="card_selection"
                                            checked={selectedCardId === card.card_id}
                                            onChange={() => setSelectedCardId(card.card_id)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedCardId === card.card_id ? 'border-amber-500' : 'border-gray-300'
                                            }`}>
                                            {selectedCardId === card.card_id && (
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <code className="text-sm font-semibold text-gray-900 tracking-wide">{card.card_uid}</code>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">
                                                {card.card_type === 'Card' && '🪪'}{card.card_type === 'Sticker' && '🏷️'}{card.card_type === 'Keychain' && '🔑'}{card.card_type === 'Other' && '📦'} {card.card_type}
                                            </p>
                                        </div>
                                        {selectedCardId === card.card_id && (
                                            <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Warning */}
                        {!showConfirm ? (
                            <>
                                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        This will remove the physical card assignment from this user. The card will become <span className="font-bold">unassigned</span> and available for reassignment.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    disabled={!selectedCardId}
                                    onClick={() => setShowConfirm(true)}
                                    className="w-full py-3.5 bg-amber-500 text-white rounded-2xl text-sm font-bold hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-100 active:scale-[0.98]"
                                >
                                    Continue
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-100">
                                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-red-700 font-bold">Are you sure?</p>
                                        <p className="text-xs text-red-600 mt-1 leading-relaxed">
                                            Card <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono text-[10px]">{user.cards.find(c => c.card_id === selectedCardId)?.card_uid}</code> will be unlinked from <span className="font-semibold">{user.email}</span>.
                                        </p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 py-3.5 bg-white text-gray-600 rounded-2xl text-sm font-bold hover:text-gray-800 transition-all border border-gray-200"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handleUnlink}
                                        className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-100 active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Unlinking…
                                            </span>
                                        ) : 'Unlink Card'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
}
