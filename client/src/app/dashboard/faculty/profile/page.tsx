'use client';

import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

export default function FacultyProfile() {
    const [user, setUser] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auth/me').then(res => {
            setUser(res.data);
            setLoading(false);
        }).catch(err => setLoading(false));
    }, []);

    if (loading) return <MentorDashboardLayout><div className="p-10 text-center">Loading...</div></MentorDashboardLayout>;

    return (
        <MentorDashboardLayout>
            <div className="relative h-48 rounded-2xl bg-gradient-to-r from-indigo-800 via-blue-800 to-sky-900 overflow-hidden mb-16 shadow-xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute bottom-4 right-6 text-white/80 text-sm font-medium tracking-wide">
                    Faculty Profile / {user.department}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 relative -mt-32">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 p-8 flex flex-col md:flex-row gap-8 items-start">

                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-blue-800 mb-4">
                            {user.name?.[0]}
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Faculty</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 w-full">
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">{user.name}</h2>
                        <p className="text-slate-500 mb-6">{user.email}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="text-xs font-bold text-slate-400 uppercase">Department</label>
                                <div className="font-semibold text-slate-700 mt-1 flex items-center gap-2">
                                    <Briefcase size={16} className="text-blue-500" />
                                    {user.department || 'General'}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="text-xs font-bold text-slate-400 uppercase">Employee ID</label>
                                <div className="font-semibold text-slate-700 mt-1 flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    {user._id?.substring(0, 8).toUpperCase()}...
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
                            <p>To update your faculty details, please contact the System Administrator.</p>
                        </div>
                    </div>

                </div>
            </div>
        </MentorDashboardLayout>
    );
}
