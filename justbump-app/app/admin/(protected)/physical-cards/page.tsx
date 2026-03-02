'use client';

import { useEffect, useState, useMemo } from 'react';
import Portal from '../../../../components/admin/Portal';
import Pagination from '../../../../components/admin/Pagination';
import DeleteConfirmationModal from '../../../../components/admin/DeleteConfirmationModal';




interface PhysicalCard {
    card_id: number;
    card_uid: string;
    card_type: string;
    status: string;
    created_at: string;
    calling_card: { full_name: string } | null;
}

const CARD_TYPES = ['Card', 'Sticker', 'Keychain', 'Other'];
const PAGE_SIZE = 10;

type InputMode = 'empty' | 'single' | 'batch' | 'invalid';

interface ParsedInput {
    mode: InputMode;
    label: string;
    uids: string[];
}

function parseSmartInput(raw: string): ParsedInput {
    const value = raw.trim();
    if (!value) return { mode: 'empty', label: '', uids: [] };

    // Batch range: e.g. 0200-0300
    const batchMatch = value.match(/^(\d+)\s*-\s*(\d+)$/);
    if (batchMatch) {
        const startStr = batchMatch[1];
        const endStr = batchMatch[2];
        const maxLen = Math.max(startStr.length, endStr.length, 4);
        const startNum = parseInt(startStr, 10);
        const endNum = parseInt(endStr, 10);

        if (isNaN(startNum) || isNaN(endNum)) {
            return { mode: 'invalid', label: 'Invalid range format', uids: [] };
        }
        if (startNum > endNum) {
            return { mode: 'invalid', label: `Start (${startStr}) must be ≤ End (${endStr})`, uids: [] };
        }
        if (endNum - startNum > 999) {
            return { mode: 'invalid', label: 'Maximum batch size is 1,000 cards', uids: [] };
        }

        const count = endNum - startNum + 1;
        const paddedStart = String(startNum).padStart(maxLen, '0');
        const paddedEnd = String(endNum).padStart(maxLen, '0');
        const uids: string[] = [];
        for (let i = startNum; i <= endNum; i++) {
            uids.push(String(i).padStart(maxLen, '0'));
        }

        return {
            mode: 'batch',
            label: `Generating ${count} card${count > 1 ? 's' : ''} (${paddedStart} to ${paddedEnd})`,
            uids,
        };
    }

    // Single: any numeric string
    if (/^\d+$/.test(value)) {
        const padded = value.padStart(4, '0');
        return {
            mode: 'single',
            label: `Single card: ${padded}`,
            uids: [padded],
        };
    }

    return { mode: 'invalid', label: 'Enter a number (e.g. 0401) or range (e.g. 0200-0300)', uids: [] };
}

function SkeletonRow() {
    return (
        <tr>
            <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded-md animate-pulse" /></td>
            <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded-md animate-pulse" /></td>
            <td className="px-6 py-4 text-center"><div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse mx-auto" /></td>
            <td className="px-6 py-4 text-center"><div className="h-4 w-16 bg-gray-100 rounded-md animate-pulse mx-auto" /></td>
            <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-100 rounded-md animate-pulse" /></td>
            <td className="px-6 py-4 text-right"><div className="h-7 w-7 bg-gray-100 rounded-lg animate-pulse ml-auto" /></td>
        </tr>
    );
}

export default function PhysicalCardsPage() {
    const [cards, setCards] = useState<PhysicalCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCard, setSelectedCard] = useState<PhysicalCard | null>(null);
    const [page, setPage] = useState(1);

    // Smart Input State
    const [inputValue, setInputValue] = useState('');
    const [cardType, setCardType] = useState('Card');
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [reviewItems, setReviewItems] = useState<{ uid: string; type: string }[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);


    // Reset review list if input changes to keep it in sync
    useEffect(() => {
        if (reviewItems.length > 0) setReviewItems([]);
    }, [inputValue]);



    const parsed = useMemo(() => parseSmartInput(inputValue), [inputValue]);

    async function fetchCards() {
        const res = await fetch('/api/admin/physical-cards');
        const data = await res.json();
        setCards(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    useEffect(() => {
        fetchCards();
    }, []);

    const filteredCards = cards.filter(card => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = card.card_uid.toLowerCase().includes(search) ||
            (card.calling_card?.full_name?.toLowerCase().includes(search));
        const matchesType = typeFilter === 'all' || card.card_type === typeFilter;
        const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredCards.length / PAGE_SIZE);
    const paginatedCards = filteredCards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Reset page when filters change
    useEffect(() => { setPage(1); }, [searchTerm, typeFilter, statusFilter]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (parsed.mode === 'empty' || parsed.mode === 'invalid' || parsed.uids.length === 0) return;

        // If it's a batch and we're not in review mode yet, switch to review
        if (parsed.mode === 'batch' && reviewItems.length === 0) {
            setReviewItems(parsed.uids.map(uid => ({ uid, type: cardType })));
            return;
        }

        setAdding(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const payload = reviewItems.length > 0
                ? { batch: reviewItems.map(item => ({ card_uid: item.uid, card_type: item.type })) }
                : { card_uid: parsed.uids[0], card_type: cardType };

            const res = await fetch('/api/admin/physical-cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to register cards');
            }

            const result = await res.json();
            setSuccessMessage(reviewItems.length > 0
                ? `${result.count} cards registered successfully`
                : `Card ${parsed.uids[0]} registered successfully`);

            setInputValue('');
            setReviewItems([]);
            fetchCards();
        } catch (err: any) {
            setErrorMessage(err.message || 'Something went wrong');
        } finally {
            setAdding(false);
            setTimeout(() => { setSuccessMessage(''); setErrorMessage(''); }, 4000);
        }
    }

    async function handleUpdate(updatedData: { card_id: number; card_uid: string; card_type: string; status: string }) {
        setUpdating(true);
        setErrorMessage('');
        try {
            const res = await fetch('/api/admin/physical-cards', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to update card');
            }
            setSelectedCard(null);
            fetchCards();
        } catch (err: any) {
            setErrorMessage(err.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    }

    async function handleDelete(id: number) {
        setIsDeleteLoading(true);
        try {
            const res = await fetch(`/api/admin/physical-cards?id=${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to delete card');
            }
            setDeletingId(null);
            fetchCards();
        } catch (err: any) {
            setErrorMessage(err.message || 'Deletion failed');
            setTimeout(() => setErrorMessage(''), 4000);
        } finally {
            setIsDeleteLoading(false);
        }
    }

    const badgeColor = {
        empty: '',
        single: 'text-brand-600 bg-brand-50 border-brand-100',
        batch: 'text-purple-600 bg-purple-50 border-purple-100',
        invalid: 'text-red-500 bg-red-50 border-red-100',
    };

    const badgeIcon = {
        empty: null,
        single: (
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
        ),
        batch: (
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
            </svg>
        ),
        invalid: (
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Physical Cards</h2>
                    <p className="mt-1 text-sm text-gray-400">Register and manage NFC card inventory.</p>
                </div>
            </div>

            {/* Grid: Left = Register, Right = Filters + Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Registration Form */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Register Cards</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Card ID</label>
                            <input
                                type="text"
                                placeholder="0401 or 0200-0300"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono outline-none transition-all duration-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 placeholder:text-gray-300"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Type</label>
                            <select
                                value={cardType}
                                onChange={(e) => setCardType(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white transition-all duration-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                            >
                                {CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={adding || parsed.mode === 'empty' || parsed.mode === 'invalid'}
                            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                        >
                            {adding ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating…
                                </span>
                            ) : reviewItems.length > 0 ? 'Confirm Creation' : 'Create'}
                        </button>

                        {/* Batch Review List */}
                        {reviewItems.length > 0 && (
                            <div className="pt-4 border-t border-gray-100 space-y-3 animate-in">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Review Batch ({reviewItems.length})</h4>
                                    <div className="flex items-center gap-3">
                                        <select
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (!val) return;
                                                setReviewItems(reviewItems.map(item => ({ ...item, type: val })));
                                            }}
                                            className="text-[10px] bg-transparent text-brand-600 font-bold border-none outline-none cursor-pointer px-0"
                                        >
                                            <option value="">Set all to...</option>
                                            {CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setReviewItems([])}
                                            className="text-[10px] text-gray-400 hover:text-gray-600 font-bold uppercase tracking-wider"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                    {reviewItems.map((item, idx) => (
                                        <div key={item.uid} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group animate-in" style={{ animationDelay: `${idx * 30}ms` }}>
                                            <code className="text-[10px] font-mono font-bold text-gray-500 w-12">{item.uid}</code>
                                            <select
                                                value={item.type}
                                                onChange={(e) => {
                                                    const newItems = [...reviewItems];
                                                    newItems[idx].type = e.target.value;
                                                    setReviewItems(newItems);
                                                }}
                                                className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded-md text-[11px] outline-none focus:border-brand-400"
                                            >
                                                {CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 italic text-center">Individual types will be preserved.</p>
                            </div>
                        )}

                        {/* Smart Badge */}
                        <div className="min-h-[32px] flex items-center">
                            {parsed.mode !== 'empty' && (
                                <div
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all duration-300 animate-in ${badgeColor[parsed.mode]}`}
                                >
                                    {badgeIcon[parsed.mode]}
                                    {parsed.label}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Success / Error Messages */}
                    {successMessage && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-medium animate-in">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && selectedCard === null && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium animate-in">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {errorMessage}
                        </div>
                    )}
                </div>

                {/* RIGHT: Filters + Table */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 items-end bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Search</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="UID or Owner name..."
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder:text-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-[120px]">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Type</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white focus:border-brand-500 transition-all"
                            >
                                <option value="all">All Types</option>
                                {CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="w-[120px]">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white focus:border-brand-500 transition-all"
                            >
                                <option value="all">All</option>
                                <option value="unassigned">Unassigned</option>
                                <option value="assigned">Assigned</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {loading ? (
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-100 bg-surface-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">UID</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">Status</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">Created At</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
                                </tbody>
                            </table>
                        ) : filteredCards.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-900">No cards found</p>
                                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or register new cards.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-100 bg-surface-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">UID</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">Status</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">Created At</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedCards.map((card) => (
                                        <tr key={card.card_id} className="hover:bg-surface-50/50 transition-colors duration-150 group">
                                            <td className="px-6 py-3.5">
                                                <code className="text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md tracking-wide">{card.card_uid}</code>
                                            </td>
                                            <td className="px-6 py-3.5 text-sm text-gray-600">
                                                <span className="flex items-center gap-1.5">
                                                    {card.card_type === 'Card' && '🪪'}
                                                    {card.card_type === 'Sticker' && '🏷️'}
                                                    {card.card_type === 'Keychain' && '🔑'}
                                                    {card.card_type === 'Other' && '📦'}
                                                    {card.card_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${card.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                    card.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                                                        card.status === 'blocked' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${card.status === 'active' ? 'bg-emerald-500' :
                                                        card.status === 'assigned' ? 'bg-blue-500' :
                                                            card.status === 'blocked' ? 'bg-red-500' :
                                                                'bg-amber-500'
                                                        }`} />
                                                    {card.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-center text-xs text-gray-500 font-mono">
                                                {new Date(card.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-3.5 text-sm text-gray-600">
                                                {card.calling_card?.full_name || <span className="text-gray-300 italic">Unassigned</span>}
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedCard(card)}
                                                        className="p-1.5 text-gray-400 hover:text-brand-600 transition-colors duration-150 rounded-lg hover:bg-brand-50"
                                                        title="Edit Card"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingId(card.card_id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors duration-150 rounded-lg hover:bg-red-50"
                                                        title="Delete Card"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                            totalItems={filteredCards.length}
                            itemsPerPage={PAGE_SIZE}
                        />
                    )}
                </div>
            </div>

            {/* Edit Drawer */}
            {selectedCard && (
                <EditSlideOver
                    card={selectedCard}
                    onClose={() => { setSelectedCard(null); setErrorMessage(''); }}
                    onSave={handleUpdate}
                    loading={updating}
                    error={errorMessage}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deletingId !== null}
                title="Delete Card?"
                description="Are you sure you want to remove this card from your inventory? This action cannot be undone."
                onConfirm={() => deletingId && handleDelete(deletingId)}
                onClose={() => setDeletingId(null)}
                isLoading={isDeleteLoading}
            />
        </div>
    );
}

function EditSlideOver({ card, onClose, onSave, loading, error }: {
    card: PhysicalCard;
    onClose: () => void;
    onSave: (data: any) => void;
    loading: boolean;
    error: string;
}) {
    const [isClosing, setIsClosing] = useState(false);
    const [uid, setUid] = useState(card.card_uid);
    const [type, setType] = useState(card.card_type);
    const [status, setStatus] = useState(card.status);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    return (
        <Portal>
            <div
                className={`fixed inset-0 bg-black/30 z-[60] transition-opacity duration-200 pointer-events-auto ${isClosing ? 'fade-out' : 'fade-in'}`}
                onClick={handleClose}
            />
            <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-sm bg-white shadow-2xl border-l border-gray-100 flex flex-col slide-in-right pointer-events-auto ${isClosing ? 'slide-out-right' : ''}`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Edit Card</h3>
                        <p className="text-xs text-gray-400 mt-0.5">UID: {card.card_uid}</p>
                    </div>
                    <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 p-6 space-y-5">
                    <div>
                        <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">UID</label>
                        <input
                            type="text"
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                        >
                            {CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                        >
                            <option value="unassigned">Unassigned</option>
                            <option value="assigned">Assigned</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {error}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={() => onSave({ card_id: card.card_id, card_uid: uid, card_type: type, status })}
                        disabled={loading}
                        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </Portal>
    );
}
