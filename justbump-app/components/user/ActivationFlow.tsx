'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PhysicalCard {
    card_id: number;
    card_uid: string;
    status: string;
}

interface ActivationFlowProps {
    userEmail: string;
    slug?: string;
    physicalCards?: PhysicalCard[];
    onActivated: () => void;
}

export default function ActivationFlow({ userEmail, slug, physicalCards = [], onActivated }: ActivationFlowProps) {
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [selectedCard, setSelectedCard] = useState<PhysicalCard | null>(
        physicalCards.length > 0 ? physicalCards[0] : null
    );

    const profileUrl = slug
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/cards/${slug}`
        : '';

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ card_uid: uid }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Activation failed');
                setLoading(false);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                setUid('');
                setSuccess(false);
                setLoading(false);
                onActivated();
            }, 2000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-center">
                {/* Visual Side — Flippable Black Card */}
                <div className="relative group flex flex-col items-center gap-6">
                    <div className="absolute -inset-8 bg-gradient-to-tr from-brand-500/10 to-brand-600/5 rounded-[3rem] blur-3xl group-hover:blur-2xl transition-all duration-1000 opacity-60 pointer-events-none" />

                    {/* 3D Flip Card Container */}
                    <div
                        className="relative w-full"
                        style={{ perspective: '1200px' }}
                        onClick={() => setFlipped(f => !f)}
                        onMouseMove={(e) => {
                            if (flipped) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = (e.clientY - rect.top - rect.height / 2) / 14;
                            const y = -(e.clientX - rect.left - rect.width / 2) / 14;
                            const inner = e.currentTarget.querySelector('[data-card-inner]') as HTMLElement;
                            if (inner) inner.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
                        }}
                        onMouseLeave={(e) => {
                            const inner = e.currentTarget.querySelector('[data-card-inner]') as HTMLElement;
                            if (inner) inner.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
                        }}
                    >
                        <div
                            data-card-inner
                            style={{
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)',
                                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                position: 'relative',
                                height: '220px',
                            }}
                            className="h-[180px] sm:h-[220px]"
                        >
                            {/* ─── FRONT FACE ─── */}
                            <div
                                style={{
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
                                    position: 'absolute',
                                    inset: 0,
                                }}
                                className="cursor-pointer"
                            >
                                <div className="bg-[#0a0a0b] rounded-[1.8rem] w-full h-full shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center border border-white/[0.05] relative">
                                    {/* Noise texture */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                    {/* Subtle top shine */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                    {/* Logo */}
                                    <div className="relative w-28 h-28 flex items-center justify-center transition-transform duration-500">
                                        <div className="absolute inset-0 bg-brand-500/5 blur-[40px] rounded-full" />
                                        <img
                                            src="/jblogo.png"
                                            alt="JustBump"
                                            className="w-full h-full object-contain brightness-0 invert"
                                        />
                                    </div>


                                    {/* Corner dots */}
                                    <div className="absolute top-5 left-5 w-1.5 h-1.5 rounded-full bg-white/10" />
                                    <div className="absolute top-5 right-5 w-1.5 h-1.5 rounded-full bg-white/10" />
                                    <div className="absolute bottom-5 left-5 w-1.5 h-1.5 rounded-full bg-white/10" />
                                    <div className="absolute bottom-5 right-5 w-1.5 h-1.5 rounded-full bg-white/10" />
                                </div>
                            </div>

                            {/* ─── BACK FACE ─── */}
                            <div
                                style={{
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)',
                                    position: 'absolute',
                                    inset: 0,
                                }}
                                className="cursor-pointer"
                            >
                                <div className="bg-[#0a0a0b] rounded-[1.8rem] w-full h-full shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center border border-white/[0.05] relative p-6">
                                    {/* Noise texture */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                    {/* Top shine */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                    {/* QR Code — center */}
                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                        <div className="bg-white p-2 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.08)]">
                                            <QRCodeSVG
                                                value={slug && profileUrl ? profileUrl : 'https://justbump.net'}
                                                size={80}
                                                bgColor="#ffffff"
                                                fgColor="#0a0a0b"
                                                level="M"
                                            />
                                        </div>
                                    </div>

                                    {/* UID — bottom right (always shown) */}
                                    <div className="absolute bottom-4 right-5 z-10 flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedCard ? 'bg-emerald-400' : 'bg-white/20'}`} />
                                        <code className="text-[9px] font-mono font-bold text-white/40 tracking-widest">
                                            {selectedCard?.card_uid ?? '0000'}
                                        </code>
                                    </div>

                                    {/* Multiple cards selector — bottom left */}
                                    {physicalCards.length > 1 && (
                                        <div className="absolute bottom-4 left-5 z-10 flex items-center gap-1">
                                            {physicalCards.map((pc) => (
                                                <button
                                                    key={pc.card_id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCard(pc);
                                                    }}
                                                    className={`w-1.5 h-1.5 rounded-full transition-all ${selectedCard?.card_id === pc.card_id ? 'bg-white scale-125' : 'bg-white/20 hover:bg-white/40'}`}
                                                />
                                            ))}
                                        </div>
                                    )}


                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flip indicator */}
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${flipped ? 'bg-brand-500' : 'bg-gray-300'}`} />
                        {flipped ? 'Showing QR' : 'Front View'}
                    </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
                            Activate your <span className="text-brand-600">Just Bump.</span>
                        </h1>
                        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                            Link your Just Bump to your digital profile. You can activate and manage multiple Just Bump products under one account.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="p-6 sm:p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">Connect Product</h4>
                                <p className="text-[10px] text-gray-500 mb-6 leading-relaxed uppercase tracking-widest font-black opacity-40">Enter UID to Activate</p>

                                <form onSubmit={handleActivate} className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                                        <input
                                            type="text"
                                            value={uid}
                                            onChange={(e) => setUid(e.target.value)}
                                            placeholder="XXXX"
                                            className="w-full sm:flex-1 px-5 py-4 rounded-2xl border border-gray-100 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder-gray-300 font-mono tracking-widest uppercase bg-gray-50/30"
                                            maxLength={10}
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading || !uid || success}
                                            className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : success ? (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                'Activate'
                                            )}
                                        </button>
                                    </div>
                                    {error && (
                                        <p className="text-[11px] text-center sm:text-left text-red-500 font-bold italic animate-in slide-in-from-left-1">{error}</p>
                                    )}
                                    {success && (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 text-center sm:text-left">
                                            <p className="text-[11px] text-green-600 font-bold italic">Product activated! Linked to your profile. ✨</p>
                                        </div>
                                    )}
                                </form>
                            </div>

                            <a
                                href="https://justbump.net/shop"
                                target="_blank"
                                className="p-6 bg-brand-50/30 rounded-2xl border border-dashed border-brand-200 hover:border-brand-400 hover:bg-brand-50/50 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-brand-600">Buy Just Bump</h4>
                                    <svg className="w-5 h-5 text-brand-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p className="text-xs text-brand-600/70">Don&apos;t have a Just Bump yet? Get yours today and start connecting instantly.</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
