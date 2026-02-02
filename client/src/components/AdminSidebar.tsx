'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCog, LogOut, MessageSquare } from 'lucide-react';

const AdminSidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
        { name: 'Communication Logs', href: '/dashboard/admin/logs', icon: MessageSquare }, // New
        { name: 'System Settings', href: '/dashboard/admin/settings', icon: UserCog },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white h-screen fixed top-0 left-0 flex flex-col z-20 shadow-xl border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 font-[family-name:var(--font-display)]">
                    Vidumurai
                </h1>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Admin Control</span>
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
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
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

export default AdminSidebar;
