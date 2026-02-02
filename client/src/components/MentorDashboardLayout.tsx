'use client';

import MentorSidebar from '@/components/MentorSidebar';
import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const MentorDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<{ name: string, role: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            // Access Control: Mentor, HOD, Admin
            if (['student'].includes(parsed.role?.toLowerCase())) {
                router.replace('/dashboard/student');
            } else if (!['mentor', 'hod', 'admin'].includes(parsed.role?.toLowerCase())) {
                router.replace('/login');
            }
        } else {
            router.replace('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-[family-name:var(--font-sans)]">
            <MentorSidebar />

            <div className="flex-1 ml-64">
                {/* Header */}
                <header className="h-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                            Faculty Dashboard <span className="text-slate-400 text-sm font-normal mx-2">|</span> <span className="text-blue-600 dark:text-blue-400">{user?.name}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/mentor/notifications" className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                        </Link>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold text-sm">
                            {user?.name?.[0] || 'F'}
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

export default MentorDashboardLayout;
