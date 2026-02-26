'use client';

import { useEffect, useState } from 'react';

interface CallingCard {
    id: number;
    user_id: number;
    slug: string;
    full_name: string;
    job_title: string;
    company: string;
    headline: string;
    address: string;
    contact_value: string;
    bank_payment_provider: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_branch_code: string;
    social_platform_name: string;
    social_handle: string;
    user: { email: string };
}

export default function CallingCardsPage() {
    const [cards, setCards] = useState<CallingCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/calling-cards')
            .then(res => res.json())
            .then(data => {
                setCards(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Calling Cards (Profiles)</h2>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading profile data...</div>
                ) : (
                    <table className="w-full text-left min-w-[1200px]">
                        <thead className="bg-surface-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Owner Email</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Profile Name</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Company/Job</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bank Details</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Socials</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Slug</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {cards.map(card => (
                                <tr key={card.id} className="hover:bg-surface-25 transition-colors text-sm">
                                    <td className="px-4 py-4 text-gray-500 font-mono">#{card.id}</td>
                                    <td className="px-4 py-4 font-medium text-gray-900">{card.user.email}</td>
                                    <td className="px-4 py-4 text-gray-700">{card.full_name}</td>
                                    <td className="px-4 py-4 text-gray-600">
                                        <div className="font-medium">{card.job_title || '-'}</div>
                                        <div className="text-xs text-gray-400">{card.company || '-'}</div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{card.contact_value || '-'}</td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {card.bank_payment_provider ? (
                                            <div className="text-xs">
                                                <div className="font-medium">{card.bank_payment_provider}</div>
                                                <div>{card.bank_account_name}</div>
                                                <div className="font-mono text-[10px]">{card.bank_account_number}</div>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {card.social_platform_name ? (
                                            <div className="text-xs">
                                                <span className="font-medium">{card.social_platform_name}:</span> {card.social_handle}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-4">
                                        <code className="bg-surface-100 px-1.5 py-0.5 rounded text-xs">{card.slug}</code>
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
