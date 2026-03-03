'use client';

import { ReactNode, useState } from 'react';
import Sidebar from '../../../components/admin/Sidebar';
import Header from '../../../components/admin/Header';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-surface-50">
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={() => setIsSidebarOpen(false)}
                onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header
                    title="Dashboard"
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
