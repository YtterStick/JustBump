'use client';

const SOCIAL_PLATFORMS = [
    'LinkedIn', 'Instagram', 'Facebook', 'Twitter', 'TikTok',
    'WhatsApp', 'YouTube', 'Custom'
];

export default function ContentTab({ 
    card, 
    addItem, 
    removeItem, 
    updateItem 
}: {
    card: any;
    addItem: (key: string, defaultObj: any) => void;
    removeItem: (key: string, index: number) => void;
    updateItem: (key: string, index: number, field: string, value: any) => void;
}) {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Social Media Links</h4>
                    <button
                        type="button"
                        onClick={() => addItem('social_links', { platform: 'LinkedIn', url: '', handle: '' })}
                        className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                    >
                        + Add Social
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {card.social_links.map((s: any, i: number) => (
                        <div key={i} className="flex gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 group">
                            <div className="flex-1 space-y-3">
                                <select
                                    value={s.platform}
                                    onChange={e => updateItem('social_links', i, 'platform', e.target.value)}
                                    className="w-full bg-transparent text-[10px] font-black uppercase tracking-widest text-brand-600 outline-none"
                                >   
                                    {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <input
                                    type="text"
                                    value={s.handle || ''}
                                    onChange={e => updateItem('social_links', i, 'handle', e.target.value)}
                                    placeholder="Username / Handle"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-100 text-xs outline-none bg-white focus:border-brand-500"
                                />
                                <input
                                    type="text"
                                    value={s.url || ''}
                                    onChange={e => updateItem('social_links', i, 'url', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 rounded-lg border border-gray-100 text-xs font-medium outline-none bg-white focus:border-brand-500"
                                />
                            </div>
                            <button type="button" onClick={() => removeItem('social_links', i)} className="text-gray-300 hover:text-red-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bank Details Section */}
            <div className="space-y-6 pt-8 border-t border-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Bank Details / Payment</h4>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">Add your accounts for easy sharing.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => addItem('bank_details', { provider: 'GCash', account_name: '', account_number: '' })}
                        className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                    >
                        + Add Bank
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {card.bank_details.map((b: any, i: number) => (
                        <div key={i} className="flex gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100 relative group">
                            <button type="button" onClick={() => removeItem('bank_details', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Provider</label>
                                    <input
                                        type="text"
                                        value={b.provider || ''}
                                        onChange={e => updateItem('bank_details', i, 'provider', e.target.value)}
                                        placeholder="e.g. GCash, BDO"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 text-xs font-bold bg-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Name</label>
                                    <input
                                        type="text"
                                        value={b.account_name || ''}
                                        onChange={e => updateItem('bank_details', i, 'account_name', e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 text-xs font-bold bg-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
                                    <input
                                        type="text"
                                        value={b.account_number || ''}
                                        onChange={e => updateItem('bank_details', i, 'account_number', e.target.value)}
                                        placeholder="0000 0000 0000"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 text-xs font-mono bg-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">External Links</h4>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">Add custom links such as portfolios or websites.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => addItem('external_links', { label: '', url: '' })}
                        className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                    >
                        + Add External Link
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {card.external_links?.map((link: any, i: number) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 relative group">
                            <button type="button" onClick={() => removeItem('external_links', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="flex-1 space-y-3 pr-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Label</label>
                                    <input
                                        type="text"
                                        value={link.label || ''}
                                        onChange={e => updateItem('external_links', i, 'label', e.target.value)}
                                        placeholder="E.g., My Portfolio"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-100 text-xs font-bold bg-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">URL</label>
                                    <input
                                        type="text"
                                        value={link.url || ''}
                                        onChange={e => updateItem('external_links', i, 'url', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 rounded-lg border border-gray-100 text-xs font-medium bg-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Links Section */}
            <div className="space-y-6 pt-8 border-t border-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Video Links</h4>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">Embed YouTube or Facebook videos.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => addItem('video_links', { title: '', url: '', thumbnail_url: '' })}
                        className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                    >
                        + Add Video
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {card.video_links?.map((v: any, i: number) => (
                        <div key={i} className="flex gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100 relative group">
                            <button type="button" onClick={() => removeItem('video_links', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5 md:col-span-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                                    <input
                                        type="text"
                                        value={v.title || ''}
                                        onChange={e => updateItem('video_links', i, 'title', e.target.value)}
                                        placeholder="Video Title"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 text-xs font-bold bg-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Video URL</label>
                                    <input
                                        type="text"
                                        value={v.url || ''}
                                        onChange={e => updateItem('video_links', i, 'url', e.target.value)}
                                        placeholder="https://youtube.com/..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 text-xs font-medium bg-white focus:border-brand-500 outline-none mb-3"
                                    />
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Thumbnail URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={v.thumbnail_url || ''}
                                        onChange={e => updateItem('video_links', i, 'thumbnail_url', e.target.value)}
                                        placeholder="https://image-url..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 text-xs font-medium bg-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
