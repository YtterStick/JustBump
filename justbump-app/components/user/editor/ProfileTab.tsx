'use client';

export default function ProfileTab({ 
    card, 
    handleFileUpload, 
    setCard, 
    addItem, 
    removeItem, 
    updateItem 
}: {
    card: any;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => void;
    setCard: (card: any) => void;
    addItem: (key: string, defaultObj: any) => void;
    removeItem: (key: string, index: number) => void;
    updateItem: (key: string, index: number, field: string, value: any) => void;
}) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            {/* Profile Visuals Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Profile Visuals</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Photo */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile Square</label>
                        </div>
                        <div className="relative group w-32 h-32">
                            <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group-hover:border-brand-500 transition-all flex items-center justify-center">
                                {card.profile_image_url ? (
                                    <img src={card.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-300">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'profile')}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {card.profile_image_url && (
                                <button
                                    onClick={() => setCard({ ...card, profile_image_url: '' })}
                                    className="absolute -top-2 -right-2 bg-white shadow-md rounded-full p-1 text-gray-400 hover:text-red-500 z-20 border border-gray-100"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Cover Photo */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cover Header</label>
                        </div>
                        <div className="relative group w-full h-32">
                            <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group-hover:border-brand-500 transition-all flex items-center justify-center">
                                {card.cover_image_url ? (
                                    <img src={card.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-300">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'cover')}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {card.cover_image_url && (
                                <button
                                    onClick={() => setCard({ ...card, cover_image_url: '' })}
                                    className="absolute -top-2 -right-2 bg-white shadow-md rounded-full p-1 text-gray-400 hover:text-red-500 z-20 border border-gray-100"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8 pt-8 border-t border-gray-50">
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Public Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                            type="text"
                            value={card.full_name}
                            onChange={e => setCard({ ...card, full_name: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border border-gray-100 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium bg-gray-50/30"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                        <input
                            type="text"
                            value={card.job_title || ''}
                            onChange={e => setCard({ ...card, job_title: e.target.value })}
                            placeholder="e.g. CEO & Founder"
                            className="w-full px-5 py-4 rounded-2xl border border-gray-100 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium bg-gray-50/30"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company</label>
                        <input
                            type="text"
                            value={card.company || ''}
                            onChange={e => setCard({ ...card, company: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border border-gray-100 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium bg-gray-50/30"
                        />
                    </div>
                </div>
                {/* Additional Bio/Info Blocks (Replaces Headline) */}
                <div className="space-y-6 pt-6 border-t border-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Profile Bio / Info Blocks</h4>
                            <p className="text-[10px] text-gray-400 font-medium">Add professional summaries, mission statements, or quick notes.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => addItem('additional_bios', { label: 'Quick Note', text: '' })}
                            className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                        >
                            + Add Info Block
                        </button>
                    </div>
                    <div className="space-y-4">
                        {card.additional_bios.map((b: any, i: number) => (
                            <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-4 relative group">
                                <button type="button" onClick={() => removeItem('additional_bios', i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={b.label || ''}
                                        onChange={e => updateItem('additional_bios', i, 'label', e.target.value)}
                                        placeholder="Title (e.g. My Mission)"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest bg-white outline-none focus:border-brand-500 transition-colors"
                                    />
                                    <textarea
                                        value={b.text || ''}
                                        onChange={e => updateItem('additional_bios', i, 'text', e.target.value)}
                                        placeholder="Write something..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 text-xs bg-white outline-none resize-none focus:border-brand-500 transition-colors"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
