'use client';

export default function SaveBar({ isDirty, saving, message }: { isDirty: boolean, saving: boolean, message: { type: string, text: string } }) {
    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-xl sticky top-4 z-50 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-4 px-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
                    <img src="/jblogo.png" alt="JB" className="w-5 h-5 object-contain brightness-0 invert" />
                </div>
                <span className="text-sm font-black text-gray-900 tracking-tight">Profile Editor</span>
            </div>
            <div className="flex items-center gap-4">
                {message.text && (
                    <p className={`text-[10px] font-bold italic ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message.text}</p>
                )}
                {isDirty && (
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg flex items-center gap-2 animate-in fade-in zoom-in-95"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                )}
            </div>
        </div>
    );
}
