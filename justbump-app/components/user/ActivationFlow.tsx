'use client';

import { useState } from 'react';

interface ActivationFlowProps {
    userEmail: string;
    onActivated: () => void;
}

export default function ActivationFlow({ userEmail, onActivated }: ActivationFlowProps) {
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Visual Side - Premium White Card */}
                <div className="relative group">
                    <div className="absolute -inset-8 bg-gradient-to-tr from-brand-500/10 to-brand-600/5 rounded-[3rem] blur-3xl group-hover:blur-2xl transition-all duration-1000 opacity-60" />

                    <div className="relative perspective-1000 h-[320px] flex items-center justify-center">
                        <div className="relative bg-[#0a0a0b] rounded-[1.8rem] w-full aspect-[1.6/1] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center p-12 border border-white/[0.05] transition-all duration-1000 group-hover:rotate-y-12">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                            <div className="relative w-32 h-32 flex items-center justify-center mb-0 transition-transform duration-500 group-hover:scale-110">
                                <div className="absolute inset-x-[-30%] inset-y-[-30%] bg-brand-500/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <img
                                    src="/jblogo.png"
                                    alt="JustBump"
                                    className="w-full h-full object-contain brightness-0 invert"
                                />
                            </div>

                            {/* Decorative HUD Elements */}
                            <div className="absolute top-8 left-8 w-10 h-8 rounded-md bg-white/5 border border-white/10 flex flex-col gap-1.5 p-2 opacity-40">
                                <div className="w-full h-0.5 bg-white/20" />
                                <div className="w-2/3 h-0.5 bg-white/20" />
                                <div className="w-full h-0.5 bg-white/20" />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                            Activate your <span className="text-brand-600">Just Bump.</span>
                        </h1>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Link your Just Bump to your digital profile. You can activate and manage multiple Just Bump products under one account.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">Connect Product</h4>
                                <p className="text-xs text-gray-500 mb-6 leading-relaxed uppercase tracking-widest font-black opacity-40">Enter UID to Activate</p>

                                <form onSubmit={handleActivate} className="space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={uid}
                                            onChange={(e) => setUid(e.target.value)}
                                            placeholder="XXXX"
                                            className="flex-1 px-5 py-4 rounded-2xl border border-gray-100 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder-gray-300 font-mono tracking-widest uppercase bg-gray-50/30"
                                            maxLength={10}
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading || !uid || success}
                                            className="px-8 py-4 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg flex items-center gap-2"
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
                                        <p className="text-[11px] text-red-500 font-bold italic animate-in slide-in-from-left-1">{error}</p>
                                    )}
                                    {success && (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
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
                                <p className="text-xs text-brand-600/70">Don't have a Just Bump yet? Get yours today and start connecting instantly.</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
