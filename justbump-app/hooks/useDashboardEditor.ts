'use client';

import { useState, useEffect } from 'react';
import { AsYouType, CountryCode } from 'libphonenumber-js';

export function useDashboardEditor(onLinkNew?: () => void) {
    const [card, setCard] = useState<any>(null);
    const [initialCard, setInitialCard] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState<'profile' | 'contacts' | 'content' | 'theme'>('profile');
    const [uploading, setUploading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>('PH');

    const isDirty = card && initialCard && JSON.stringify(card) !== JSON.stringify(initialCard);

    const fetchCard = async () => {
        try {
            const res = await fetch('/api/user/calling-card');
            const data = await res.json();
            if (res.ok) {
                const normalizedData = {
                    ...data,
                    social_links: data.social_links || [],
                    video_links: data.video_links || [],
                    additional_contacts: data.additional_contacts || [],
                    additional_bios: data.additional_bios || [],
                    external_links: data.external_links || [],
                    bank_details: data.bank_details || []
                };
                setCard(normalizedData);
                setInitialCard(normalizedData);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCard();
    }, []);

    const handleSave = async (dataOrEvent?: any) => {
        const cardToSave = (dataOrEvent && typeof dataOrEvent === 'object' && 'nativeEvent' in dataOrEvent)
            ? card : (dataOrEvent || card);
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/calling-card', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardToSave),
            });

            if (res.ok) {
                const updatedData = await res.json();
                setCard(updatedData);
                setInitialCard(updatedData);
                setMessage({ type: 'success', text: 'Profile updated successfully! ✨' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                const errorData = await res.json().catch(() => ({}));
                setMessage({ type: 'error', text: `Failed: ${errorData.message || errorData.error || 'Server error'}` });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: `Connection error: ${err.message}` });
        } finally {
            setSaving(false);
        }
    };

    const addItem = (key: string, defaultObj: any) => {
        setCard({ ...card, [key]: [...card[key], defaultObj] });
    };

    const removeItem = (key: string, index: number) => {
        const list = [...card[key]];
        list.splice(index, 1);
        setCard({ ...card, [key]: list });
    };

    const updateItem = (key: string, index: number, field: string, value: any) => {
        const list = [...card[key]];
        list[index] = { ...list[index], [field]: value };
        setCard({ ...card, [key]: list });
    };

    const handlePhoneChange = (value: string, onChange: (val: string) => void, countryOverride?: CountryCode) => {
        let input = value;
        const country = countryOverride || selectedCountry;

        if (!input.startsWith('+')) {
            if (input.startsWith('09')) {
                input = '+63' + input.substring(1);
                setSelectedCountry('PH');
            } else if (/^9\d{2}/.test(input) && !input.startsWith('911')) {
                input = '+63' + input;
                setSelectedCountry('PH');
            }
        }

        const formatter = new AsYouType(country);
        const formatted = formatter.input(input);

        if (formatted.length <= 17) {
            onChange(formatted);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover' = 'profile') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/user/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                const key = type === 'profile' ? 'profile_image_url' : 'cover_image_url';
                setCard({ ...card, [key]: data.url });
                setMessage({ type: 'success', text: `${type === 'profile' ? 'Profile' : 'Cover'} photo uploaded! Click "Save Profile" to persist. ✨` });
            } else {
                setMessage({ type: 'error', text: data.error || 'Upload failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    return {
        card,
        setCard,
        loading,
        saving,
        message,
        setMessage,
        activeTab,
        setActiveTab,
        uploading,
        selectedCountry,
        setSelectedCountry,
        isDirty,
        handleSave,
        addItem,
        removeItem,
        updateItem,
        handlePhoneChange,
        handleFileUpload
    };
}
