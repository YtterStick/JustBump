'use client';

import CustomColorPicker from './CustomColorPicker';
import CustomSelect from './CustomSelect';

const FONTS = [
    { value: 'inter', label: 'Inter (Modern)' },
    { value: 'outfit', label: 'Outfit (Sleek)' },
    { value: 'roboto', label: 'Roboto (Standard)' },
    { value: 'playfair', label: 'Playfair (Elegant)' }
];

export default function ThemeTab({ 
    card, 
    setCard 
}: {
    card: any;
    setCard: (card: any) => void;
}) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Core Branding</h4>
                        <div className="grid grid-cols-1 gap-6">
                            <CustomColorPicker
                                label="Accent Color"
                                value={card.theme_primary_color || '#fbbf24'}
                                onChange={val => setCard({ ...card, theme_primary_color: val })}
                            />
                            <CustomColorPicker
                                label="Text Color"
                                value={card.theme_text_color || '#ffffff'}
                                onChange={val => setCard({ ...card, theme_text_color: val })}
                            />
                            <CustomSelect
                                label="Typography"
                                value={card.theme_font || 'inter'}
                                onChange={val => setCard({ ...card, theme_font: val })}
                                options={FONTS}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Card Appearance</h4>
                        <div className="grid grid-cols-1 gap-6">
                            <CustomColorPicker
                                label="Secondary Accent"
                                value={card.theme_secondary_color || '#000000'}
                                onChange={val => setCard({ ...card, theme_secondary_color: val })}
                            />
                            <CustomColorPicker
                                label="Background"
                                value={card.theme_background_color || '#F9FAFB'}
                                onChange={val => setCard({ ...card, theme_background_color: val })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
