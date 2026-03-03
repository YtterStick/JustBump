'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function UserAuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';
            const payload = mode === 'signin'
                ? { email, password }
                : { email, password, phone_number: phoneNumber };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Authentication failed');
                setLoading(false);
                return;
            }

            if (mode === 'signup') {
                // After signup, switch to signin or auto-login
                setMode('signin');
                setError('');
                alert('Account created successfully! Please sign in.');
                setLoading(false);
            } else {
                window.location.href = '/';
            }
        } catch {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <img
                        src="/jblogo.png"
                        alt="JustBump Logo"
                        className="h-24 w-auto object-contain mb-4"
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900">
                            {mode === 'signin' ? 'Sign In' : 'Create Account'}
                        </h2>
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === 'signin' ? 'signup' : 'signin');
                                setError('');
                            }}
                            className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                        >
                            {mode === 'signin' ? 'Register' : 'Sign In'}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition-all placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                                    placeholder="Email address"
                                />
                            </div>

                            {mode === 'signup' && (
                                <div className="animate-in slide-in-from-top-2 duration-200">
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition-all placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                                        placeholder="Phone number (optional)"
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition-all placeholder-gray-400 pr-12 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.644C3.391 7.126 7.318 4 12 4c4.681 0 8.609 3.126 9.964 7.678 1.012.012 1.012.644 0 .644-1.355 4.552-5.283 7.678-9.964 7.678-4.682 0-8.609-3.126-9.963-7.678z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500/20 transition-all cursor-pointer" />
                                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                            </label>
                            {mode === 'signin' && (
                                <button
                                    type="button"
                                    className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                                >
                                    Forgot password?
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-xl bg-gray-900 hover:bg-black text-white text-base font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    {mode === 'signin' ? 'Signing in...' : 'Creating Account...'}
                                </span>
                            ) : (
                                mode === 'signin' ? 'Sign In' : 'Sign Up'
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-gray-500">
                    {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="ml-1 font-bold text-gray-900 border-b border-gray-900 pb-0.5"
                    >
                        {mode === 'signin' ? 'Register here' : 'Login here'}
                    </button>
                </p>
            </div>
        </div>
    );
}
