'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart2,
    Users,
    FileText,
    Settings,
    LogOut,
    LayoutDashboard,
    QrCode,
    Award
} from 'lucide-react';

const HodSidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/dashboard/hod', icon: LayoutDashboard },
        { name: 'All Leaves', href: '/dashboard/hod/all-leaves', icon: FileText },
        { name: 'Gate Pass Requests', href: '/dashboard/faculty/gate-pass', icon: QrCode },
        { name: 'On Duty Requests', href: '/dashboard/faculty/od', icon: Award }, // New
        { name: 'Manage Classes', href: '/dashboard/faculty/classes', icon: Users },
        { name: 'Profile Requests', href: '/dashboard/faculty/profile-requests', icon: Users }, // Standardized path
        { name: 'Class Analytics', href: '/dashboard/hod/class-analytics', icon: BarChart2 },
        { name: 'Advanced Reports', href: '/dashboard/hod/reports', icon: FileText },
        { name: 'Announcements', href: '/dashboard/hod/announcements', icon: FileText },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white h-screen fixed top-0 left-0 flex flex-col z-20 shadow-xl">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400 font-[family-name:var(--font-display)]">
                    Vidumurai
                </h1>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">HOD // Admin</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors font-medium">
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default HodSidebar;
