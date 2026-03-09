'use client';

import { useEffect, useState } from 'react';
import Portal from '../../../../components/admin/Portal';
import Pagination from '../../../../components/admin/Pagination';



interface BankDetail {
    provider: string;
    account_name: string;
    account_number: string;
}

interface SocialLink {
    platform: string;
    handle: string;
    url: string;
}

interface VideoLink {
    title: string;
    url: string;
    description?: string;
}

interface ExternalLink {
    label: string;
    url: string;
}

interface CallingCard {
    id: number;
    user_id: number;
    slug: string;
    full_name: string;
    job_title: string;
    company: string;
    headline: string;
    address: string;
    bio_label: string;
    bio_text: string;
    contact_value: string;
    user: { email: string };
    bank_details: BankDetail[];
    social_links: SocialLink[];
    video_links: VideoLink[];
    external_links: ExternalLink[];
}

function SkeletonRow() {
    return (
        <tr>
            <td className="px-6 py-4"><div className="h-4 w-10 bg-gray-100 rounded-md animate-pulse" /></td>
            <td className="px-6 py-4"><div className="h-4 w-36 bg-gray-100 rounded-md animate-pulse" /></td>
            <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-100 rounded-md animate-pulse" /></td>
            <td className="px-6 py-4"><div className="h-5 w-20 bg-gray-100 rounded-md animate-pulse" /></td>
            <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded-md animate-pulse" /></td>
            <td className="px-6 py-4 text-right"><div className="h-7 w-7 bg-gray-100 rounded-lg animate-pulse ml-auto" /></td>
        </tr>
    );
}

function SlideOver({ card, onClose }: { card: CallingCard; onClose: () => void }) {
    const [isClosing, setIsClosing] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    const allLinks: string[] = [
        ...(card.social_links || []).map(l => l.url),
        ...(card.video_links || []).map(l => l.url),
        ...(card.external_links || []).map(l => l.url),
    ];

    async function handleCopyAll() {
        try {
            await navigator.clipboard.writeText(allLinks.join('\n'));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = allLinks.join('\n');
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <Portal>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-[999] transition-opacity duration-200 pointer-events-auto ${isClosing ? 'fade-out' : 'fade-in'}`}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col slide-in-right pointer-events-auto ${isClosing ? 'slide-out-right' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{card.full_name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">/{card.slug}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Summary Section */}
                    <div className="px-6 py-5 space-y-3 border-b border-gray-50">
                        <DetailRow label="Email" value={card.user.email} />
                        <DetailRow label="Job Title" value={card.job_title} />
                        <DetailRow label="Company" value={card.company} />
                        <DetailRow label="Headline" value={card.headline} />
                        <DetailRow label="Address" value={card.address} />
                        <DetailRow label="Contact" value={card.contact_value} mono />
                        {card.bio_text && (
                            <div>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                    {card.bio_label || 'Bio'}
                                </span>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{card.bio_text}</p>
                            </div>
                        )}
                    </div>

                    {/* Bank Details */}
                    {card.bank_details?.length > 0 && (
                        <div className="px-6 py-4 border-b border-gray-50">
                            <SectionLabel>Bank Details</SectionLabel>
                            <div className="space-y-3 mt-2">
                                {card.bank_details.map((bank, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                                        <div className="text-sm font-medium text-gray-900">{bank.provider}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{bank.account_name}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{bank.account_number}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Social Links */}
                    {card.social_links?.length > 0 && (
                        <div className="px-6 py-4 border-b border-gray-50">
                            <SectionLabel>Social Links</SectionLabel>
                            <div className="space-y-1.5 mt-2">
                                {card.social_links.map((link, i) => (
                                    <LinkRow key={i} label={link.platform} sublabel={link.handle} url={link.url} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Video Links */}
                    {card.video_links?.length > 0 && (
                        <div className="px-6 py-4 border-b border-gray-50">
                            <SectionLabel>Videos</SectionLabel>
                            <div className="space-y-1.5 mt-2">
                                {card.video_links.map((link, i) => (
                                    <LinkRow key={i} label={link.title || 'Video'} sublabel={link.description} url={link.url} icon="video" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* External Links */}
                    {card.external_links?.length > 0 && (
                        <div className="px-6 py-4 border-b border-gray-50">
                            <SectionLabel>External Links</SectionLabel>
                            <div className="space-y-1.5 mt-2">
                                {card.external_links.map((link, i) => (
                                    <LinkRow key={i} label={link.label} url={link.url} icon="external" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer — Copy All */}
                {allLinks.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-white">
                        <button
                            onClick={handleCopyAll}
                            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${copied
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
                                }`}
                        >
                            {copied ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Copied {allLinks.length} links
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                    </svg>
                                    Copy all links ({allLinks.length})
                                </span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </Portal>
    );
}

function DetailRow({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
    if (!value) return null;
    return (
        <div className="flex items-baseline justify-between gap-4">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex-shrink-0">{label}</span>
            <span className={`text-sm text-gray-700 text-right truncate ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
        </div>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{children}</span>
            <div className="flex-1 h-px bg-gray-100" />
        </div>
    );
}

function LinkRow({ label, sublabel, url, icon }: { label: string; sublabel?: string; url: string; icon?: string }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
        >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${icon === 'video' ? 'bg-red-50 text-red-500' :
                icon === 'external' ? 'bg-blue-50 text-blue-500' :
                    'bg-purple-50 text-purple-500'
                }`}>
                {icon === 'video' ? (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>
                ) : icon === 'external' ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.061a4.5 4.5 0 00-6.364-6.364L4.5 8.282a4.5 4.5 0 006.364 6.364l1.757-1.757" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">{label}</div>
                {sublabel && <div className="text-[11px] text-gray-400 truncate">{sublabel}</div>}
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
        </a>
    );
}

export default function CallingCardsPage() {
    const [cards, setCards] = useState<CallingCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        limit: 10
    });
    const [selectedCard, setSelectedCard] = useState<CallingCard | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCards(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchCards = (targetPage: number) => {
        setLoading(true);
        const params = new URLSearchParams({
            page: targetPage.toString(),
            limit: pagination.limit.toString(),
            search: searchTerm
        });

        fetch(`/api/admin/calling-cards?${params}`)
            .then(res => res.json())
            .then(res => {
                setCards(Array.isArray(res.data) ? res.data : []);
                if (res.pagination) {
                    setPagination(res.pagination);
                    setPage(res.pagination.page);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching cards:', err);
                setLoading(false);
            });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchCards(newPage);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Calling Cards</h2>
                    <p className="mt-1 text-sm text-gray-400">Digital profile cards overview.</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search name, email, slug…"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 sm:text-sm transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Data Display */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow overflow-hidden">
                {loading ? (
                    <div className="hidden md:block">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-100 bg-surface-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Profile Name</th>
                                    <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
                            </tbody>
                        </table>
                    </div>
                ) : cards.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">No cards found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search term.</p>
                    </div>
                ) : (
                    <>
                        {/* Table view for Desktop / Tablet */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-100 bg-surface-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Profile Name</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Slug</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {cards.map(card => (
                                        <tr
                                            key={card.id}
                                            className="hover:bg-surface-50/50 transition-colors duration-150 cursor-pointer group"
                                            onClick={() => setSelectedCard(card)}
                                        >
                                            <td className="px-6 py-3.5 text-xs text-gray-400 font-mono">#{card.id}</td>
                                            <td className="px-6 py-3.5 text-sm text-gray-900 font-medium">{card.user.email}</td>
                                            <td className="px-6 py-3.5 text-sm text-gray-700">{card.full_name}</td>
                                            <td className="px-6 py-3.5">
                                                <code className="text-xs text-brand-600 font-semibold bg-brand-50 px-1.5 py-0.5 rounded-md">
                                                    {card.slug}
                                                </code>
                                            </td>
                                            <td className="px-6 py-3.5 text-sm text-gray-500">{card.company || <span className="text-gray-300">—</span>}</td>
                                            <td className="px-6 py-3.5 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCard(card);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-brand-600 transition-colors duration-150 rounded-lg hover:bg-brand-50"
                                                    title="View details"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Card view for Mobile */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {cards.map(card => (
                                <div
                                    key={card.id}
                                    className="p-4 space-y-3 active:bg-gray-50 transition-colors"
                                    onClick={() => setSelectedCard(card)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400 font-mono">#{card.id}</span>
                                        <code className="text-[10px] text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded-md tracking-wide">
                                            /{card.slug}
                                        </code>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-gray-900">{card.full_name}</h4>
                                        <p className="text-xs text-gray-500 truncate">{card.user.email}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                            {card.company || 'No Company'}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-brand-600 text-[10px] font-bold">
                                            View Details
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {!loading && (
                <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                />
            )}

            {/* Slide-over Drawer */}
            {selectedCard && (
                <SlideOver
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                />
            )}
        </div>
    );
}
