'use client';

import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { useState, useEffect } from 'react';
import { Bell, UserPlus, ClipboardList } from 'lucide-react';
import api from '@/lib/api';

export default function MentorNotifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Pending Leaves
                const leavesRes = await api.get('/leaves/pending');
                const pendingLeaves = leavesRes.data.map((l: any) => ({
                    id: l._id,
                    type: 'Action Required',
                    title: 'New Leave Request',
                    message: `${l.student.name} requested ${l.leaveType} leave.`,
                    date: l.createdAt,
                    icon: ClipboardList,
                    color: 'bg-orange-100 text-orange-700'
                }));

                // Fetch Pending Profile Requests
                const profileRes = await api.get('/users/profile-requests');
                const pendingProfiles = profileRes.data.map((p: any) => ({
                    id: p.id,
                    type: 'Profile Update',
                    title: 'Profile Change Request',
                    message: `${p.student} wants to update their profile details.`,
                    date: new Date(), // Mock date if not in res
                    icon: UserPlus,
                    color: 'bg-blue-100 text-blue-700'
                }));

                setNotifications([...pendingLeaves, ...pendingProfiles]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <MentorDashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
                        <p className="text-slate-500">Pending actions and system alerts.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-slate-400">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notif: any, idx: number) => {
                            const Icon = notif.icon;
                            // Generate unique key if ids clash between types
                            return (
                                <div key={notif.id + idx} className="glass-card p-4 bg-white border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
                                    <div className={`p-3 rounded-full h-fit shrink-0 ${notif.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-1">{notif.type}</h4>
                                            <span className="text-xs text-slate-400">{new Date(notif.date).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-semibold text-slate-700 mb-1">{notif.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">{notif.message}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">You are all caught up!</p>
                    </div>
                )}
            </div>
        </MentorDashboardLayout>
    );
}
