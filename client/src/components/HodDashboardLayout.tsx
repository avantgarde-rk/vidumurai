'use client';

import HodSidebar from '@/components/HodSidebar';
import { Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HodDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<{ name: string, role: string, department: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            // Access Control: HOD Only (and Admin)
            if (parsed.role !== 'hod' && parsed.role !== 'admin') {
                if (parsed.role === 'student') router.replace('/dashboard/student');
                else if (parsed.role === 'mentor') router.replace('/dashboard/mentor');
                else router.replace('/login');
            }
        } else {
            router.replace('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-[family-name:var(--font-sans)]">
            <HodSidebar />

            <div className="flex-1 ml-64">
                {/* Header */}
                <header className="h-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                            {user?.department || 'Department'} Overview <span className="text-slate-400 text-sm font-normal mx-2">|</span> <span className="text-teal-600 dark:text-teal-400">{user?.name}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="bg-slate-100 dark:bg-slate-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 w-64 transition-all"
                            />
                        </div>
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">5</span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                            {user?.name?.[0] || 'H'}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default HodDashboardLayout;
