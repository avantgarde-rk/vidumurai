'use client';

import HodDashboardLayout from '@/components/HodDashboardLayout';
import { motion } from 'framer-motion';
import { DepartmentAttendanceChart, LeaveDistributionChart } from '@/components/charts/HodCharts';
import { Users, TrendingDown, ClipboardList } from 'lucide-react'; // Removing unused 'Clock' if any? No.
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function HodDashboard() {

    const [stats, setStats] = useState({ studentCount: 0, approvedLeaves: 0, absentToday: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users/stats/department')
            .then(res => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <HodDashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-indigo-500 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Department Strength</h3>
                        <div className="text-4xl font-extrabold text-indigo-700 mt-2">
                            {loading ? '...' : stats.studentCount}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-emerald-600 text-sm font-semibold">
                        <span className="bg-emerald-100 p-1 rounded"><Users size={16} /></span>
                        <span>Active Students</span>
                    </div>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-purple-500 bg-white">
                    <div>
                        <h3 className="text-slate-500 font-medium text-sm text-xs font-bold uppercase tracking-wider">Today's Absenteeism</h3>
                        <div className="text-4xl font-bold text-purple-700 mt-2">
                            {/* Placeholder until attendance logic is full connected */}
                            0%
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-purple-600 text-sm font-semibold">
                        <span className="bg-purple-100 p-1 rounded"><TrendingDown size={16} /></span>
                        <span>Within limits</span>
                    </div>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between bg-white border-l-4 border-violet-600 shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Leaves Approved</h3>
                        <div className="text-4xl font-extrabold text-violet-700 mt-2">
                            {loading ? '...' : stats.approvedLeaves}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-violet-600 text-sm font-semibold">
                        <span className="bg-violet-100 p-1 rounded"><ClipboardList size={16} /></span>
                        <span>All Time</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 bg-white border border-slate-100"
                >
                    <h3 className="text-lg font-bold mb-6 text-purple-900 border-b border-purple-100 pb-2">Attendance Overview</h3>
                    <DepartmentAttendanceChart />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 bg-white border border-slate-100"
                >
                    <h3 className="text-lg font-bold mb-6 text-purple-900 border-b border-purple-100 pb-2">Leave Types Analysis</h3>
                    <div className="flex items-center justify-center">
                        <LeaveDistributionChart />
                    </div>
                    <div className="flex justify-center gap-4 text-xs text-slate-500 mt-4">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Sick</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Casual</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>On Duty</span>
                    </div>
                </motion.div>
            </div>
        </HodDashboardLayout>
    );
}
