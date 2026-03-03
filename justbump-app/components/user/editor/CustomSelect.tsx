'use client';

import { useRef, useEffect, useState } from 'react';

export default function CustomSelect({ value, onChange, options, label, className = "" }: { 
    value: string, 
    onChange: (val: string) => void, 
    options: { value: string, label: string, icon?: string | React.ReactNode }[], 
    label?: string, 
    className?: string 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-3 rounded-xl border border-gray-100 text-sm outline-none bg-white flex items-center justify-between group hover:border-brand-500 transition-all shadow-sm active:scale-[0.98] h-12"
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    {selectedOption?.icon && <div className="flex-shrink-0 flex items-center justify-center w-6">{selectedOption.icon}</div>}
                    <span className="font-bold text-gray-900 leading-none truncate">{selectedOption?.label || value}</span>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-[100] mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-5 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${value === opt.value ? 'text-brand-600 bg-brand-50/50 font-bold' : 'text-gray-700'}`}
                            >
                                {opt.icon && <div className="flex-shrink-0 flex items-center justify-center w-6">{opt.icon}</div>}
                                <span className="leading-none font-medium">{opt.label}</span>
                                {value === opt.value && <span className="ml-auto text-brand-500 text-xs">●</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
