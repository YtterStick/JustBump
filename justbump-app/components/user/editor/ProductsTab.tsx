'use client';

import { useState } from 'react';

export default function ProductsTab({ card, setCard }: { card: any, setCard: (card: any) => void }) {
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Unlink states
    const [unlinkingId, setUnlinkingId] = useState<number | null>(null);

    const handleLinkProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/user/cards/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ card_uid: uid }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to link product.');
                return;
            }

            setSuccess('Product linked successfully!');
            setUid('');
            
            // Optimistically update the card context
            setCard({
                ...card,
                physical_cards: [...(card.physical_cards || []), data.card]
            });

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUnlinkProduct = async (cardId: number, cardUid: string) => {
        if (!confirm(`Are you sure you want to unlink product ${cardUid}?`)) return;
        
        setUnlinkingId(cardId);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/user/cards/unlink', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ card_uid: cardUid }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to unlink product.');
                return;
            }

            setSuccess(`Product ${cardUid} unlinked successfully.`);
            
            // Optimistically update
            setCard({
                ...card,
                physical_cards: (card.physical_cards || []).filter((p: any) => p.card_id !== cardId)
            });

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setUnlinkingId(null);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-6">
                <div>
                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Manage Products</h4>
                    <p className="text-xs text-gray-500 mt-1">Link your Just Bump products to this profile or remove existing ones.</p>
                </div>

                {/* Link New Product Section */}
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem]">
                    <h5 className="font-bold text-gray-900 mb-2">Link a New Product</h5>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mb-4">Enter the UID found on the back of your product.</p>
                    
                    <form onSubmit={handleLinkProduct} className="flex gap-3 relative">
                        <input
                            type="text"
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                            placeholder="XXXX"
                            className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder-gray-300 font-mono tracking-widest uppercase bg-white transition-all shadow-sm"
                            maxLength={10}
                        />
                        <button
                            type="submit"
                            disabled={loading || !uid}
                            className="px-6 py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md flex items-center justify-center min-w-[120px]"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Link Product'
                            )}
                        </button>
                    </form>
                    
                    {error && <p className="text-[11px] text-red-500 font-bold italic mt-3 animate-in slide-in-from-left-1">{error}</p>}
                    {success && <p className="text-[11px] text-green-600 font-bold italic mt-3 animate-in fade-in">{success}</p>}
                </div>

                {/* List of Linked Products */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h5 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-900">Your Linked Products ({card.physical_cards?.length || 0})</h5>
                    
                    {(!card.physical_cards || card.physical_cards.length === 0) ? (
                         <div className="py-8 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                             <p className="text-sm text-gray-400 font-medium">No products linked yet.</p>
                         </div>
                    ) : (
                        <div className="grid gap-3">
                            {card.physical_cards.map((p: any) => (
                                <div key={p.card_uid} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-bold font-mono text-gray-900 tracking-wider group-hover:text-brand-600 transition-colors">{p.card_uid}</span>
                                                <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                                                {p.card_type} • Linked on {new Date(p.activated_at || p.assigned_at || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUnlinkProduct(p.card_id, p.card_uid)}
                                        disabled={unlinkingId === p.card_id}
                                        className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100 disabled:opacity-50"
                                    >
                                        {unlinkingId === p.card_id ? 'Removing...' : 'Untie'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
