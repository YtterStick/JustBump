'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ActivationFlow from '../components/user/ActivationFlow';
import DashboardEditor from '../components/user/DashboardEditor';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showActivation, setShowActivation] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // Check if user wants to link a new product via URL
    if (window.location.search.includes('action=activate')) {
      setShowActivation(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Profile</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* Simple Top Bar */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center">
          <img
            src="/jblogo.png"
            alt="JustBump Logo"
            className="h-9 w-auto object-contain cursor-pointer"
            onClick={() => setShowActivation(false)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Signed in as</p>
            <p className="text-xs font-bold text-gray-900">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' }); // Reuse admin logout for now if same endpoint
              window.location.href = '/login';
            }}
            className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all group"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {(!user.is_activated || showActivation) ? (
        <ActivationFlow
          userEmail={user.email}
          onActivated={() => {
            fetchUser();
            setShowActivation(false);
          }}
        />
      ) : (
        <DashboardEditor onLinkNew={() => setShowActivation(true)} />
      )}
    </main>
  );
}
