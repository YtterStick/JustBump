'use client';

import { useDashboardEditor } from '../../hooks/useDashboardEditor';
import PreviewCard from './editor/PreviewCard';
import SaveBar from './editor/SaveBar';
import ProfileTab from './editor/ProfileTab';
import ContactsTab from './editor/ContactsTab';
import ContentTab from './editor/ContentTab';
import ThemeTab from './editor/ThemeTab';
import ProductsTab from './editor/ProductsTab';

export default function DashboardEditor() {
    const {
        card,
        loading,
        saving,
        message,
        activeTab,
        setActiveTab,
        handleSave,
        isDirty,
        addItem,
        removeItem,
        updateItem,
        handlePhoneChange,
        handleFileUpload,
        setCard
    } = useDashboardEditor();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Loading Profile</p>
            </div>
        );
    }

    if (!card) return null;

    return (
        <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Fixed Preview Side (Desktop) */}
                <PreviewCard card={card} />

                {/* Main Editor Section */}
                <form 
                    className="flex-1 space-y-8" 
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    {/* Floating Save Bar */}
                    <SaveBar isDirty={isDirty} saving={saving} message={message} />

                    {/* Tab Navigation */}
                    <div className="flex p-1.5 bg-gray-100 rounded-2xl w-full sm:w-fit gap-1 shadow-inner overflow-x-auto custom-scrollbar no-scrollbar-mobile">
                        {(['profile', 'contacts', 'content', 'theme', 'products'] as const).map(tab => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 min-w-fit ${activeTab === tab ? 'bg-white text-brand-600 shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[500px] p-5 sm:p-10">
                        {activeTab === 'profile' && (
                            <ProfileTab 
                                card={card} 
                                handleFileUpload={handleFileUpload} 
                                setCard={setCard} 
                                addItem={addItem} 
                                removeItem={removeItem} 
                                updateItem={updateItem} 
                            />
                        )}

                        {activeTab === 'contacts' && (
                            <ContactsTab 
                                card={card} 
                                setCard={setCard} 
                                addItem={addItem} 
                                removeItem={removeItem} 
                                updateItem={updateItem} 
                                handlePhoneChange={handlePhoneChange} 
                            />
                        )}

                        {activeTab === 'content' && (
                            <ContentTab 
                                card={card} 
                                addItem={addItem} 
                                removeItem={removeItem} 
                                updateItem={updateItem} 
                            />
                        )}

                        {activeTab === 'theme' && (
                            <ThemeTab 
                                card={card} 
                                setCard={setCard} 
                            />
                        )}

                        {activeTab === 'products' && (
                            <ProductsTab 
                                card={card} 
                                setCard={setCard} 
                            />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
