'use client';

import HodDashboardLayout from '@/components/HodDashboardLayout';
import { useState, useEffect } from 'react';
import { Megaphone, Send, Users, Trash2, Clock } from 'lucide-react';
import api from '@/lib/api';

export default function Announcements() {
    const [form, setForm] = useState({ title: '', message: '', audience: 'All', targetClass: '' });
    const [loading, setLoading] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);

    useEffect(() => { fetchAnnouncements(); }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/announcements', form);
            alert('Announcement Posted Successfully!');
            setForm({ title: '', message: '', audience: 'All', targetClass: '' });
            fetchAnnouncements();
        } catch (err: any) {
            console.error(err);
            alert('Failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <HodDashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Megaphone className="text-purple-600" />
                        Announcement Center
                    </h2>
                    <p className="text-slate-500 text-sm">Send urgent updates or holiday notices to students and faculty.</p>
                </div>

                <div className="glass-card p-8 bg-white border border-slate-100 shadow-lg mb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Title / Subject</label>
                            <input
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Cyclone Warning - Holiday Declared"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all font-medium"
                                required
                            />
                        </div>

                        {/* Audience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Target Audience</label>
                                <div className="relative">
                                    <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select
                                        value={form.audience}
                                        onChange={e => setForm({ ...form, audience: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none appearance-none"
                                    >
                                        <option value="All">All Department</option>
                                        <option value="Faculty">Faculty Only</option>
                                        <option value="Students">Students Only</option>
                                        <option value="Class">Specific Class</option>
                                    </select>
                                </div>
                            </div>

                            {/* Class Selector (Conditional) */}
                            {form.audience === 'Class' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Select Class</label>
                                    <input
                                        value={form.targetClass}
                                        onChange={e => setForm({ ...form, targetClass: e.target.value })}
                                        placeholder="e.g. IV-CSE-A"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Message Content</label>
                            <textarea
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                rows={4}
                                placeholder="Type your announcement details here..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex items-center justify-end gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 flex items-center gap-2 transform active:scale-95 transition-all"
                            >
                                <Send size={18} />
                                {loading ? 'Posting...' : 'Post Announcement'}
                            </button>
                        </div>

                    </form>
                </div>

                {/* List View */}
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Recent History</h3>
                    <div className="space-y-4">
                        {announcements.length > 0 ? announcements.map((a: any) => (
                            <div key={a._id} className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl h-fit">
                                    <Megaphone size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-800 text-lg">{a.title}</h4>
                                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">{a.audience}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-3">{a.message}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(a.createdAt).toLocaleString()}</span>
                                        {a.targetClass && <span className="text-purple-600">Target: {a.targetClass}</span>}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed">
                                No announcements posted yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HodDashboardLayout>
    );
}
