'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setEmailError(false);
        setPasswordError(false);
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);

                if (data.error === 'Invalid credentials' || data.error === 'Access denied') {
                    setEmailError(true);
                    setPasswordError(true);
                    setPassword(''); // Clear to show placeholder error
                }
                return;
            }

            window.location.href = '/admin';
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
                    <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">
                        Sign in to JustBump
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError(false);
                                }}
                                className={`w-full px-5 py-3 rounded-xl border text-gray-900 text-sm outline-none transition-all placeholder-gray-400 
                                    ${emailError
                                        ? 'border-red-500 bg-red-50/30 placeholder-red-400 focus:ring-red-500/20'
                                        : 'border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'}`}
                                placeholder={emailError ? 'Invalid credentials' : 'Email address'}
                            />
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (passwordError) setPasswordError(false);
                                    }}
                                    className={`w-full px-5 py-3 rounded-xl border text-gray-900 text-sm outline-none transition-all placeholder-gray-400 pr-12
                                        ${passwordError
                                            ? 'border-red-500 bg-red-50/30 placeholder-red-400 focus:ring-red-500/20'
                                            : 'border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'}`}
                                    placeholder={passwordError ? (emailError ? 'Invalid credentials' : 'Incorrect password') : 'Password'}
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
                                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Keep me signed in</span>
                            </label>
                            <button
                                type="button"
                                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                                onClick={() => alert('Password recovery is being configured.')}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 px-6 rounded-xl text-white text-base font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                                ${emailError || passwordError ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-900 hover:bg-black'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-gray-500">
                    Protected by JustBump Security System
                </p>
            </div>
        </div>
    );
}

