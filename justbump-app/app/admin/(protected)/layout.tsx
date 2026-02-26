import { ReactNode } from 'react';
import Sidebar from '../../../components/admin/Sidebar';
import Header from '../../../components/admin/Header';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-surface-50">
            <Sidebar />
            <div className="ml-64 flex flex-col min-h-screen">
                <Header title="Dashboard" />
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
