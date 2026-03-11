'use client';

import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import CustomSelect from './CustomSelect';

const COUNTRIES = [
    { code: 'PH', name: 'Philippines' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'CA', name: 'Canada' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'UAE' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'TH', name: 'Thailand' },
];

export default function ContactsTab({ 
    card, 
    setCard, 
    addItem, 
    removeItem, 
    updateItem, 
    handlePhoneChange 
}: {
    card: any;
    setCard: (card: any) => void;
    addItem: (key: string, defaultObj: any) => void;
    removeItem: (key: string, index: number) => void;
    updateItem: (key: string, index: number, field: string, value: any) => void;
    handlePhoneChange: (value: string, onChange: (val: string) => void) => void;
}) {
    const contacts = card.additional_contacts || [];

    return (
        <div className="space-y-10">
            {/* Primary Contact (index 0) */}
            {contacts.length > 0 ? (
                <div className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 space-y-6">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        Primary Contact
                        <span className="text-[10px] text-brand-500 lowercase font-bold tracking-normal italic">(always call + message)</span>
                    </h4>
                    <div className="flex gap-4">
                        <CustomSelect
                            value={COUNTRIES.find(c => contacts[0]?.value?.startsWith('+' + getCountryCallingCode(c.code as CountryCode)))?.code || 'PH'}
                            onChange={(val: string) => {
                                const code = getCountryCallingCode(val as CountryCode);
                                const currentVal = contacts[0]?.value || '';
                                let newVal = currentVal;
                                if (!currentVal.startsWith('+')) {
                                    newVal = '+' + code + currentVal;
                                } else {
                                    newVal = '+' + code + currentVal.replace(/^\+\d+/, '');
                                }
                                updateItem('additional_contacts', 0, 'value', newVal);
                            }}
                            options={COUNTRIES.map(c => ({
                                value: c.code,
                                label: c.code,
                                icon: <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} width="16" alt="" className="rounded-sm" />
                            }))}
                            className="w-32"
                        />
                        <input
                            type="text"
                            value={contacts[0]?.value || ''}
                            onChange={e => handlePhoneChange(e.target.value, (val: string) => updateItem('additional_contacts', 0, 'value', val))}
                            placeholder="Primary Mobile Number"
                            className="flex-1 px-5 py-3 rounded-xl border border-gray-100 text-sm font-mono outline-none focus:border-brand-500 bg-white shadow-sm"
                        />
                    </div>
                </div>
            ) : (
                <div className="p-8 rounded-3xl bg-gray-50/50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <p className="text-xs text-gray-400 font-medium">No contacts yet</p>
                    <button
                        type="button"
                        onClick={() => {
                            const newContacts = [{ value: '', action_type: 'both' }];
                            setCard({ ...card, additional_contacts: newContacts });
                        }}
                        className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                    >
                        + Add Primary Contact
                    </button>
                </div>
            )}

            {/* Additional Contacts (index 1+) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Additional Numbers</h4>
                    <button
                        type="button"
                        onClick={() => addItem('additional_contacts', { value: '', action_type: 'call' })}
                        className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                    >
                        + Add Number
                    </button>
                </div>
                <div className="space-y-4">
                    {contacts.slice(1).map((c: any, idx: number) => {
                        const i = idx + 1; // actual index in the array
                        return (
                            <div key={i} className="flex flex-col gap-3 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm group">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="flex gap-2">
                                            <CustomSelect
                                                value={COUNTRIES.find(country => c.value?.startsWith('+' + getCountryCallingCode(country.code as CountryCode)))?.code || 'PH'}
                                                onChange={(val: string) => {
                                                    const code = getCountryCallingCode(val as CountryCode);
                                                    const currentVal = c.value || '';
                                                    let newVal = currentVal;
                                                    if (!currentVal.startsWith('+')) {
                                                        newVal = '+' + code + currentVal;
                                                    } else {
                                                        newVal = '+' + code + currentVal.replace(/^\+\d+/, '');
                                                    }
                                                    updateItem('additional_contacts', i, 'value', newVal);
                                                }}
                                                options={COUNTRIES.map(country => ({
                                                    value: country.code,
                                                    label: country.code,
                                                    icon: <img src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} width="16" alt="" className="rounded-sm" />
                                                }))}
                                                className="w-28"
                                            />
                                            <input
                                                type="text"
                                                value={c.value || ''}
                                                onChange={e => handlePhoneChange(e.target.value, (val: string) => updateItem('additional_contacts', i, 'value', val))}
                                                placeholder="Number"
                                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-100 text-xs font-mono outline-none focus:border-brand-500 bg-gray-50/20"
                                            />
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeItem('additional_contacts', i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 px-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect via:</p>
                                    <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                                        {(['call', 'message'] as const).map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => updateItem('additional_contacts', i, 'action_type', type)}
                                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${c.action_type === type ? 'bg-white text-brand-600 shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                {type === 'call' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                                                {type === 'message' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                                                <span className="ml-0.5">{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
