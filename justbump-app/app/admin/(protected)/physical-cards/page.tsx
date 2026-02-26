'use client';

import { useEffect, useState } from 'react';

interface PhysicalCard {
    card_id: number;
    card_uid: string;
    card_type: string;
    status: string;
    created_at: string;
    calling_card: { full_name: string } | null;
}

const CARD_TYPES = ['Card', 'Sticker', 'Keychain', 'Other'];

export default function PhysicalCardsPage() {
    const [cards, setCards] = useState<PhysicalCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUid, setNewUid] = useState('');
    const [cardType, setCardType] = useState('Card');
    const [adding, setAdding] = useState(false);

    async function fetchCards() {
        const res = await fetch('/api/admin/physical-cards');
        const data = await res.json();
        setCards(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    useEffect(() => {
        fetchCards();
    }, []);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setAdding(true);
        try {
            let formattedUid = newUid;
            if (/^\d+$/.test(newUid)) {
                formattedUid = newUid.padStart(3, '0');
            }

            const res = await fetch('/api/admin/physical-cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    card_uid: formattedUid,
                    card_type: cardType
                }),
            });
            if (res.ok) {
                setNewUid('');
                fetchCards();
            }
        } finally {
            setAdding(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to remove this card from inventory?')) return;
        const res = await fetch(`/api/admin/physical-cards?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchCards();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Physical Cards Inventory</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Manual Registration</h3>
                <form onSubmit={handleAdd} className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Card UID</label>
                        <input
                            type="text"
                            placeholder="e.g. 055"
                            value={newUid}
                            onChange={(e) => setNewUid(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                        />
                    </div>
                    <div className="w-[150px]">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Type</label>
                        <select
                            value={cardType}
                            onChange={(e) => setCardType(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white"
                        >
                            {CARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={adding || !newUid}
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                        >
                            {adding ? 'Adding...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading inventory...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-surface-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Row</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">UID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Assigned To</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {cards.map((card, index) => (
                                <tr key={card.card_id} className="hover:bg-surface-25 transition-colors group">
                                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-bold tracking-widest">{card.card_uid}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-2">
                                            {card.card_type === 'Card' && '🪪'}
                                            {card.card_type === 'Sticker' && '🏷️'}
                                            {card.card_type === 'Keychain' && '🔑'}
                                            {card.card_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${card.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                            {card.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {card.calling_card?.full_name || <span className="text-gray-300 italic">Unassigned</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(card.card_id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                            title="Delete Card"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
