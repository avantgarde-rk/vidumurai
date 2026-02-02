'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { Bell, Megaphone, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

export default function StudentNotifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Announcements
                const announcementsRes = await api.get('/announcements');
                const announcements = announcementsRes.data
                    .filter((a: any) => ['All', 'Students'].includes(a.audience)) // Matched with backend
                    .map((a: any) => ({
                        id: a._id,
                        type: 'Announcement',
                        title: a.title,
                        message: a.message,
                        date: a.createdAt,
                        icon: Megaphone,
                        color: 'bg-indigo-100 text-indigo-700'
                    }));

                // Fetch Recent Leaves Updates
                const leavesRes = await api.get('/leaves');
                const leavesUpdates = leavesRes.data
                    .filter((l: any) => l.status !== 'Pending') // Only show updates
                    .slice(0, 5) // Last 5
                    .map((l: any) => ({
                        id: l._id,
                        type: 'Leave Update',
                        title: `Leave ${l.status}`,
                        message: `Your leave for ${l.reason} was ${l.status}.`,
                        date: l.updatedAt || l.startDate,
                        icon: l.status === 'Approved' ? CheckCircle : AlertTriangle,
                        color: l.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }));

                // Combine and Sort
                const all = [...announcements, ...leavesUpdates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setNotifications(all);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardLayout role="Student">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
                        <p className="text-slate-500">Updates, announcements, and alerts.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-slate-400">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notif: any) => {
                            const Icon = notif.icon;
                            return (
                                <div key={notif.id} className="glass-card p-4 bg-white border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
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
                        <p className="text-slate-500">No new notifications</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
