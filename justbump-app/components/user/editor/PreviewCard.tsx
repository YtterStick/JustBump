import { AsYouType, CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { inter, roboto, outfit, playfair } from '../../../app/fonts';

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

const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
    if (p.includes('instagram')) return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>;
    if (p.includes('facebook')) return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>;
    if (p.includes('twitter') || p.includes('x.')) return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>;
    if (p.includes('tiktok')) return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.3-.7.35-1.08.01-1.56 0-3.12 0-4.69V.02z" /></svg>;
    if (p.includes('whatsapp')) return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.89 9.884 0 2.225.659 3.891 1.746 5.634l-.999 3.648 3.744-.983zm11.367-7.854c-.3-.15-1.774-.875-2.048-.976-.274-.1-.474-.15-.674.15-.2.3-.774 1.012-.949 1.212-.174.199-.349.224-.648.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.3-.349.45-.525.15-.174.199-.3.3-.499.1-.2.05-.375-.025-.525-.075-.15-.674-1.625-.925-2.224-.244-.589-.493-.51-.674-.519-.174-.01-.374-.01-.574-.01-.2 0-.524.075-.798.374-.275.3-1.047 1.022-1.047 2.492 0 1.47 1.074 2.894 1.223 3.094.149.2 2.115 3.227 5.125 4.537.714.31 1.272.496 1.706.636.717.226 1.369.194 1.882.117.573-.085 1.774-.724 2.023-1.424.249-.699.249-1.299.174-1.424-.075-.125-.275-.199-.575-.349z" /></svg>;
    if (p.includes('youtube')) return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
    if (p.includes('email')) return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    return <span className="text-[10px] font-bold">{platform[0].toUpperCase()}</span>;
};

const getCountryFlag = (phoneNumber: string, className = "w-4 h-3 object-cover rounded-sm inline-block mb-0.5") => {
    if (!phoneNumber) return null;
    const formatter = new AsYouType();
    formatter.input(phoneNumber);
    const countryCode = formatter.getCountry();
    
    if (!countryCode) {
        const match = phoneNumber.match(/^\+(\d{1,3})/);
        if (match) {
            const code = match[1];
            const country = COUNTRIES.find(c => getCountryCallingCode(c.code as CountryCode) === code);
            if (country) return <span className="text-[10px] font-black opacity-30">{country.code}</span>;
        }
        return null;
    }

    return (
        <img 
            src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`} 
            alt=""
            className={className}
        />
    );
};

const getActionIcons = (actionType: string) => {
    const isBoth = actionType === 'both';
    const isCall = actionType === 'call' || isBoth;
    const isMessage = actionType === 'message' || isBoth;

    return (
        <div className="flex gap-1.5 opacity-60">
            {isCall && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
            {isMessage && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
        </div>
    );
};

export default function PreviewCard({ card }: { card: any }) {
    if (!card) return null;

    return (
        <div className="lg:w-80 space-y-6 lg:sticky lg:top-8 h-fit">
            <div
                className={`rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group border border-white/5 ${inter.variable} ${roboto.variable} ${outfit.variable} ${playfair.variable}`}
                style={{
                    backgroundColor: card.theme_background_color || '#F9FAFB',
                    fontFamily: card.theme_font === 'inter' ? 'var(--font-inter)' :
                        card.theme_font === 'roboto' ? 'var(--font-roboto)' :
                            card.theme_font === 'outfit' ? 'var(--font-outfit)' :
                                card.theme_font === 'playfair' ? 'var(--font-playfair)' : 'inherit'
                }}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500/40 to-transparent opacity-50 z-20" />

                <div className="relative w-full h-32">
                    <div className="absolute inset-0 w-full h-full bg-gray-50/50 rounded-t-[2.5rem] overflow-hidden">
                        {card.cover_image_url && (
                            <img src={card.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                        )}
                    </div>

                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-3xl bg-white flex items-center justify-center border-4 border-white overflow-hidden shadow-2xl transition-all duration-700 group-hover:scale-110 z-10">
                        {card.profile_image_url ? (
                            <img src={card.profile_image_url} alt={card.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <img src="/jblogo.png" alt="JustBump" className="w-12 h-12 object-contain brightness-0 invert" />
                        )}
                    </div>
                </div>

                <div className="p-8 pt-12 space-y-6">
                    <div className="space-y-1">
                        <h3
                            className="text-xl font-black leading-tight truncate px-4"
                            style={{
                                color: card.theme_text_color || '#ffffff',
                                textShadow: (card.theme_text_color === '#ffffff' || card.theme_text_color?.toLowerCase() === '#fff') ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            {card.full_name}
                        </h3>
                        <p
                            className="text-[10px] font-black uppercase tracking-widest leading-loose"
                            style={{ color: card.theme_primary_color || '#fbbf24' }}
                        >
                            {card.job_title || 'Identity'}
                        </p>
                        {card.company && <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider">{card.company}</p>}
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        {card.social_links.slice(0, 6).map((s: any, i: number) => (
                            <div
                                key={i}
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/70 border transition-all hover:scale-110 hover:text-white"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    borderColor: 'rgba(255,255,255,0.15)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            >
                                {getSocialIcon(s.platform)}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                        {card.contact_value && (
                            <div className="flex items-center justify-center gap-2.5 text-white/80">
                                <span className="opacity-80 flex items-center">{getCountryFlag(card.contact_value, "w-4 h-3 object-cover rounded-sm")}</span>
                                <span className="text-[10px] font-mono font-bold tracking-tight">{card.contact_value}</span>
                                {getActionIcons('both')}
                            </div>
                        )}
                        {card.additional_contacts.slice(0, 3).map((c: any, i: number) => (
                            <div key={i} className="flex items-center justify-center gap-2.5 text-white/50">
                                <span className="opacity-80 flex items-center">{getCountryFlag(c.value, "w-4 h-3 object-cover rounded-sm")}</span>
                                <span className="text-[9px] font-mono font-bold tracking-tight">{c.value}</span>
                                {getActionIcons(c.action_type)}
                            </div>
                        ))}
                    </div>

                    {card.bank_details?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                            {card.bank_details.slice(0, 2).map((b: any, i: number) => (
                                <div key={i} className="bg-white/5 rounded-xl p-2.5 border border-white/5 backdrop-blur-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span 
                                            className="text-[8px] font-black uppercase tracking-widest transition-colors"
                                            style={{ color: card.theme_primary_color || '#fbbf24' }}
                                        >
                                            {b.provider}
                                        </span>
                                        <span className="text-[8px] text-white/30 font-bold uppercase">{i === 0 ? 'Primary Bank' : 'Reserve'}</span>
                                    </div>
                                    <p className="text-[10px] text-white font-bold tracking-tight mb-0.5">{b.account_name}</p>
                                    <p className="text-[9px] text-white/60 font-mono tracking-wider">{b.account_number}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {card.additional_bios?.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {card.additional_bios.map((b: any, i: number) => (
                                <div key={i} className="text-center">
                                    {b.label && <h5 className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{b.label}</h5>}
                                    <p className="text-[9px] text-white/70 leading-relaxed font-medium px-4">{b.text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-4">
                        <a
                            href={`/cards/${card.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] transition-colors"
                            onMouseEnter={(e) => e.currentTarget.style.color = card.theme_primary_color || '#fbbf24'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                        >
                            View Profile
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
