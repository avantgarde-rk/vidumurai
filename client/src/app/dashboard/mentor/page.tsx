'use client';

import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { motion } from 'framer-motion';
import { ClipboardCheck, Users, TrendingUp, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MentorDashboard() {
    const [stats, setStats] = useState({ pending: 0, totalStudents: 0, todayPresent: 0 });
    const [recentLeaves, setRecentLeaves] = useState([]);

    useEffect(() => {
        // Fetch pending leaves
        api.get('/leaves/pending')
            .then(res => {
                setStats(prev => ({ ...prev, pending: res.data.length }));
                setRecentLeaves(res.data.slice(0, 5));
            })
            .catch(console.error);

        // Mock stats for students (In real app, fetch /users?role=student&mentor=me)
        setStats(prev => ({ ...prev, totalStudents: 42, todayPresent: 38 }));
    }, []);

    return (
        <MentorDashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Pending Requests Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 bg-white border-l-4 border-purple-500"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Pending Requests</h3>
                            <div className="text-4xl font-bold text-purple-700 mt-2">{stats.pending}</div>
                        </div>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <ClipboardCheck size={24} />
                        </div>
                    </div>
                </motion.div>

                {/* Total Students Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 bg-white border-l-4 border-indigo-500"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">My Students</h3>
                            <div className="text-3xl font-bold text-indigo-700 mt-2">{stats.totalStudents}</div>
                        </div>
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Users size={24} />
                        </div>
                    </div>
                </motion.div>

                {/* Today's Attendance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 bg-white border-l-4 border-violet-500"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Present Today</h3>
                            <div className="text-3xl font-bold text-violet-700 mt-2">{stats.todayPresent}</div>
                        </div>
                        <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </motion.div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-slate-800">Pending Approvals</h3>
            <div className="glass-card overflow-hidden bg-white shadow-sm border border-slate-100">
                <table className="w-full text-left text-sm">
                    <thead className="bg-purple-50 border-b border-purple-100">
                        <tr>
                            <th className="p-4 font-semibold text-purple-900">Student Name</th>
                            <th className="p-4 font-semibold text-purple-900">Type</th>
                            <th className="p-4 font-semibold text-purple-900">Duration</th>
                            <th className="p-4 font-semibold text-purple-900">Reason</th>
                            <th className="p-4 font-semibold text-purple-900">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {recentLeaves.length > 0 ? recentLeaves.map((leave: any) => (
                            <tr key={leave._id} className="hover:bg-purple-50/50 transition-colors">
                                <td className="p-4 font-medium">
                                    <div className="flex flex-col">
                                        <span>{leave.student?.name}</span>
                                        <span className="text-xs text-slate-400">{leave.student?.rollNo}</span>
                                    </div>
                                </td>
                                <td className="p-4">{leave.leaveType}</td>
                                <td className="p-4 text-slate-500">
                                    {leave.totalDays} Days
                                    <div className="text-xs text-slate-400">
                                        {new Date(leave.startDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-4 text-slate-500 max-w-xs truncate">{leave.reason}</td>
                                <td className="p-4">
                                    <a href={`/dashboard/mentor/leaves`} className="text-blue-600 font-semibold text-xs border border-blue-200 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 transition">
                                        Review
                                    </a>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">No pending approvals.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </MentorDashboardLayout>
    );
}
