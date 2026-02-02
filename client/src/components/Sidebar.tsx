'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ClipboardList, User, LogOut, Settings, QrCode, FileText, Award } from 'lucide-react';

const Sidebar = ({ role }: { role?: string }) => {
    const pathname = usePathname();

    const studentItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard/student' },
        { name: 'My Profile', icon: User, path: '/dashboard/student/profile' },
        { name: 'Gate Pass', icon: QrCode, path: '/dashboard/student/gatepass' },
        { name: 'On Duty', icon: Award, path: '/dashboard/student/od' },
        { name: 'Apply Leave', icon: Calendar, path: '/dashboard/student/leave' },
        { name: 'History', icon: FileText, path: '/dashboard/student/leave/history' },
    ];

    return (
        <aside className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col transition-all">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 font-[family-name:var(--font-display)]">
                    Vidumurai
                </h1>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Student Portal</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {studentItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? 'bg-purple-700 text-white shadow-lg shadow-purple-500/30'
                                : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <Icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium">
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
