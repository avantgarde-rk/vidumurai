'use client';

import Sidebar from './Sidebar';
import { Bell, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const DashboardLayout = ({ children, role = 'Student' }: { children: React.ReactNode, role?: string }) => {
    const [user, setUser] = useState<{ name: string, role: string } | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            // Strict Role Check
            // Ensure Role matches the Layout's intended audience
            if (role && parsed.role && parsed.role.toLowerCase() !== role.toLowerCase()) {
                // Allow Admin to access everything? Maybe not for strict demo isolation.
                // Redirect to their OWN dashboard
                console.warn(`[RBAC] Access Denied. Required: ${role}, Found: ${parsed.role}`);
                if (parsed.role === 'student') router.replace('/dashboard/student');
                else if (parsed.role === 'mentor') router.replace('/dashboard/mentor');
                else if (parsed.role === 'hod') router.replace('/dashboard/hod');
                else if (parsed.role === 'admin') router.replace('/dashboard/admin');
                else router.replace('/login');
            }
        } else {
            router.replace('/login');
        }
    }, [role, router]);

    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                if (role === 'Student') {
                    const [annRes, leavesRes] = await Promise.all([
                        api.get('/announcements'),
                        api.get('/leaves')
                    ]);
                    const newAnnouncements = annRes.data.filter((a: any) =>
                        ['All', 'Student'].includes(a.targetAudience) &&
                        new Date(a.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Last 3 days
                    ).length;
                    const newUpdates = leavesRes.data.filter((l: any) =>
                        l.status !== 'Pending' &&
                        new Date(l.updatedAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Last 3 days
                    ).length;
                    setNotifCount(newAnnouncements + newUpdates);
                }
            } catch (e) { console.error(e); }
        };
        fetchCount();
        const interval = setInterval(fetchCount, 60000); // Polling every minute
        return () => clearInterval(interval);
    }, [role]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-[family-name:var(--font-sans)]">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Wrapper for Mobile */}
            <div className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:translate-x-0 lg:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar role={role} />
            </div>

            <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
                {/* Header */}
                <header className="h-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {role === 'Student' ? 'My Dashboard' : role === 'Faculty' ? 'Faculty Portal' : role === 'HOD' ? 'HOD Portal' : 'Admin Panel'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                placeholder="Search..."
                                className="bg-slate-100 dark:bg-slate-800 pl-10 pr-4 py-2 rounded-full text-sm outline-none w-48 lg:w-64 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-slate-600 dark:text-slate-300"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/student/notifications" className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <Bell size={20} />
                                {notifCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                                        {notifCount}
                                    </span>
                                )}
                            </Link>

                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                {user?.name?.[0] || 'S'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-4 md:p-8 animate-fade-in flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
