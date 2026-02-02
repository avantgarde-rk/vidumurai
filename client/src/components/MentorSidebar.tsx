'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ClipboardCheck,
    Users,
    LogOut,
    QrCode,
    Award,
    UserCheck
} from 'lucide-react';

const MentorSidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/dashboard/mentor', icon: LayoutDashboard },
        { name: 'Leave Requests', href: '/dashboard/mentor/leaves', icon: ClipboardCheck },
        { name: 'Gate Pass', href: '/dashboard/faculty/gate-pass', icon: QrCode },
        { name: 'Attendance', href: '/dashboard/faculty/attendance', icon: UserCheck }, // New
        { name: 'On Duty', href: '/dashboard/faculty/od', icon: Award }, // New
        { name: 'My Classes', href: '/dashboard/faculty/classes', icon: Users },
        { name: 'Profile Requests', href: '/dashboard/faculty/profile-requests', icon: Users },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white h-screen fixed top-0 left-0 flex flex-col z-20 shadow-xl border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 font-[family-name:var(--font-display)]">
                    Vidumurai
                </h1>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Faculty Portal</span>
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
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
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

export default MentorSidebar;
