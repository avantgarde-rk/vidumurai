'use client';

import AdminSidebar from '@/components/AdminSidebar';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<{ name: string, role: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            // Access Control: Admin Only
            if (parsed.role !== 'admin') {
                if (parsed.role === 'student') router.replace('/dashboard/student');
                else if (parsed.role === 'mentor') router.replace('/dashboard/mentor');
                else if (parsed.role === 'hod') router.replace('/dashboard/hod');
                else router.replace('/login');
            }
        } else {
            router.replace('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 flex font-[family-name:var(--font-sans)]">
            <AdminSidebar />

            <div className="flex-1 ml-64">
                <header className="h-16 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-slate-700">
                            System Administration <span className="text-slate-400 text-sm font-normal mx-2">|</span> <span className="text-purple-600">{user?.name}</span>
                        </h2>
                    </div>
                    <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                        <Bell size={20} />
                    </button>
                </header>

                <main className="p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
