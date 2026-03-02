'use client';

import { useState, useEffect } from 'react';
import Portal from './Portal';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onClose: () => void;
    isLoading?: boolean;
    confirmLabel?: string;
}

export default function DeleteConfirmationModal({
    isOpen,
    title,
    description,
    onConfirm,
    onClose,
    isLoading,
    confirmLabel = "Delete"
}: DeleteConfirmationModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsAnimating(true);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setShouldRender(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <Portal>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-[9998] transition-opacity duration-200 pointer-events-auto ${isAnimating ? 'fade-in' : 'fade-out'}`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full overflow-hidden pointer-events-auto transition-all duration-200 ${isAnimating ? 'animate-in scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                >
                    <div className="p-6">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    {isLoading ? 'Processing...' : confirmLabel}
                                </span>
                            ) : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
