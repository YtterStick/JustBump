'use client';

import { useRef, useEffect, useState } from 'react';

export default function CustomColorPicker({ value, onChange, label, className = "" }: { 
    value: string, 
    onChange: (val: string) => void, 
    label?: string, 
    className?: string 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const PRESETS = [
        '#0a7aff', '#fbbf24', '#10b981', '#f43f5e', '#8b5cf6',
        '#0f172a', '#ffffff', '#6b7280', '#000000', '#F9FAFB'
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-2 ml-1">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-xl border border-gray-100 bg-white hover:border-brand-500 transition-all shadow-sm active:scale-[0.98] group w-full"
            >
                <div
                    className="w-9 h-9 rounded-lg shadow-inner border border-black/5 flex-shrink-0"
                    style={{ backgroundColor: value || '#ffffff' }}
                />
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">{value || '#FFFFFF'}</span>
                <svg className={`ml-auto w-3 h-3 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-[110] mt-3 left-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2 origin-top-left">
                    <div className="space-y-4">
                        <div className="grid grid-cols-5 gap-2">
                            {PRESETS.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => {
                                        onChange(p);
                                        setIsOpen(false);
                                    }}
                                    className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 active:scale-95 ${value?.toLowerCase() === p.toLowerCase() ? 'border-brand-500 shadow-md scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: p }}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-[10px] font-mono font-bold uppercase outline-none focus:ring-2 focus:ring-brand-500/20 border border-transparent focus:border-brand-500/30 w-full"
                            />
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                <input
                                    type="color"
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] cursor-pointer border-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
