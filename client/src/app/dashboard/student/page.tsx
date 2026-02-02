'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, TrendingUp, AlertTriangle, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function StudentDashboard() {
    const [stats, setStats] = useState({ attendance: 0, present: 0, total: 0 });
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [attendanceStatus, setAttendanceStatus] = useState<string | null>(null);

    // Calculate status based on time if not marked
    const calculateTimeBasedStatus = () => {
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();

        if (hour > 9 || (hour === 9 && minutes > 15)) return 'Absent';
        if (hour === 9 && minutes > 0) return 'Late';
        return 'Present';
    };

    const fetchDashboardData = async () => {
        try {
            const [attendanceRes, leavesRes, announcementsRes] = await Promise.all([
                api.get('/attendance/me'),
                api.get('/leaves'),
                api.get('/announcements')
            ]);

            setStats({
                attendance: parseFloat(attendanceRes.data.summary.percentage),
                present: attendanceRes.data.summary.presentDays,
                total: attendanceRes.data.summary.totalDays
            });

            // Auto-detect status logic
            if (attendanceRes.data.today) {
                setAttendanceStatus(attendanceRes.data.today.status);
            } else {
                setAttendanceStatus(calculateTimeBasedStatus());
            }

            setLeaves(leavesRes.data.slice(0, 3));
            // Filter announcements for Student/All
            const relevantAnnouncements = announcementsRes.data.filter((a: any) =>
                ['All', 'Student'].includes(a.targetAudience) ||
                (a.targetAudience === 'Class' && a.targetClass === 'IV-CSE-A')
            );
            setAnnouncements(relevantAnnouncements.slice(0, 3));
        } catch (e) {
            console.error("Failed to fetch data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleMarkAttendance = async () => {
        setMarking(true);
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();

        // Time Logic
        // 9:00 AM is 9, 00
        // 9:15 AM is 9, 15

        let status = 'Present';
        let color = 'green';

        if (hour > 9 || (hour === 9 && minutes > 15)) {
            status = 'Absent';
            color = 'red';
        } else if (hour === 9 && minutes > 0) {
            status = 'Late';
            color = 'amber';
        }

        try {
            // In real app, we check WiFi IP here
            await api.post('/attendance/mark', {
                deviceId: 'browser-' + Date.now(),
                locationIP: '192.168.1.1',
                status: status // Send calculated status
            });

            setAttendanceStatus(status);
            alert(`Attendance Marked as ${status}!`);
            fetchDashboardData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setMarking(false);
        }
    };

    // Helper for Attendance Color
    const getStatusColor = () => {
        if (attendanceStatus === 'Absent') return 'text-red-500';
        if (attendanceStatus === 'Late') return 'text-amber-500';
        return 'text-emerald-500'; // Present
    };

    return (
        <DashboardLayout role="Student">
            {/* Announcements Ticker / Section */}
            {announcements.length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-4 text-white shadow-lg flex items-center gap-4 animate-fade-in">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <AlertTriangle size={20} className="text-yellow-300" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">Latest Announcement</span>
                            <span className="font-medium truncate">{announcements[0].title}: {announcements[0].content}</span>
                        </div>
                    </div>
                    <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition">View All</button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* ... Stats Cards (Unchanged) ... */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-4 bg-white border-l-4 border-purple-500">
                    <h4 className="text-slate-500 text-xs font-bold uppercase">Sem Attendance</h4>
                    <div className="text-2xl font-bold text-slate-800">{stats.attendance}%</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-4 bg-white border-l-4 border-blue-500">
                    <h4 className="text-slate-500 text-xs font-bold uppercase">CAT 1</h4>
                    <div className="text-2xl font-bold text-slate-800">88%</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-4 bg-white border-l-4 border-indigo-500">
                    <h4 className="text-slate-500 text-xs font-bold uppercase">CAT 2</h4>
                    <div className="text-2xl font-bold text-slate-800">92%</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-4 bg-white border-l-4 border-violet-500">
                    <h4 className="text-slate-500 text-xs font-bold uppercase">CAT 3</h4>
                    <div className="text-2xl font-bold text-slate-800">--</div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Attendance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 flex flex-col justify-between bg-slate-900 text-white shadow-xl shadow-slate-300 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px] group-hover:bg-emerald-500/30 transition-all"></div>
                    <div>
                        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider">Attendance Status</h3>
                        <div className={`text-4xl font-extrabold mt-2 ${getStatusColor()}`}>
                            {attendanceStatus === 'Absent' ? 'Absent' : attendanceStatus === 'Late' ? 'Late Entry' : 'Present'}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 relative z-10">
                        <button
                            onClick={handleMarkAttendance}
                            disabled={marking || attendanceStatus === 'Absent' || attendanceStatus === 'Present' || attendanceStatus === 'Late'}
                            className={`w-full py-2 text-white rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${attendanceStatus === 'Absent' ? 'bg-red-600 cursor-not-allowed opacity-80' :
                                attendanceStatus === 'Late' ? 'bg-amber-600 hover:bg-amber-700' :
                                    attendanceStatus === 'Present' ? 'bg-emerald-600 cursor-not-allowed opacity-80' :
                                        'bg-emerald-600 hover:bg-emerald-500'
                                }`}
                        >
                            {marking ? <Clock size={16} className="animate-spin" /> : <Wifi size={16} />}
                            {marking ? 'Marking...' : (attendanceStatus === 'Absent' ? 'Marked Absent' : attendanceStatus === 'Present' ? 'Marked Present' : attendanceStatus === 'Late' ? 'Mark Late Entry' : 'Mark Attendance')}
                        </button>

                        <div className={`flex items-center gap-2 text-xs font-semibold justify-center ${getStatusColor()}`}>
                            {attendanceStatus !== 'Absent' && <span className={`w-2 h-2 rounded-full animate-pulse ${attendanceStatus === 'Late' ? 'bg-amber-500' : 'bg-emerald-400'}`}></span>}
                            <span>{attendanceStatus === 'Absent' ? 'Marked Absent (> 9:15 AM)' : 'Connected to Campus Wi-Fi'}</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={120} />
                    </div>
                </motion.div>

                {/* Pending Leaves */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 bg-white"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Leave Status</h3>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-800 mb-1">
                        {leaves.filter((l: any) => l.status === 'Pending').length}
                    </div>
                    <p className="text-sm text-slate-400">Request(s) Pending Approval</p>
                </motion.div>

                {/* Notifications / Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 bg-white"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Alerts</h3>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {/* On Duty Alert Logic */}
                        {leaves.some((l: any) => l.leaveType === 'On-Duty' && l.status === 'Approved' && !l.isOdCompleted && new Date(l.endDate) < new Date()) && (
                            <div className="flex flex-col gap-2 text-sm text-purple-700 bg-purple-50 p-3 rounded-lg border border-purple-100">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={16} className="shrink-0" />
                                    <p className="font-semibold">OD Proof Required!</p>
                                </div>
                                <p className="text-xs opacity-80">You have completed an OD. Please upload proof of attendance.</p>
                                <button className="text-xs bg-purple-600 text-white py-1 px-2 rounded w-fit self-end">Upload Proof</button>
                            </div>
                        )}

                        {stats.attendance < 75 ? (
                            <div className="flex items-start gap-3 text-sm text-red-600 bg-slate-50 p-2 rounded-lg border border-red-100">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                <p>Low Attendance! You are below the 75% threshold.</p>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3 text-sm text-green-600 bg-slate-50 p-2 rounded-lg border border-green-100">
                                <CheckCircle size={16} className="shrink-0 mt-0.5" />
                                <p>You are in the safe zone. Keep it up!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-slate-800">Recent Leave Requests</h3>
            <div className="glass-card overflow-hidden bg-white shadow-sm border border-slate-100">
                <table className="w-full text-left text-sm">
                    <thead className="bg-purple-50 border-b border-purple-100">
                        <tr>
                            <th className="p-4 font-semibold text-purple-900">Type</th>
                            <th className="p-4 font-semibold text-purple-900">Dates</th>
                            <th className="p-4 font-semibold text-purple-900">Reason</th>
                            <th className="p-4 font-semibold text-purple-900">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                        {leaves.length > 0 ? leaves.map((leave: any) => (
                            <tr key={leave._id} className="hover:bg-purple-50/50 transition-colors">
                                <td className="p-4 font-medium">{leave.leaveType}</td>
                                <td className="p-4 text-slate-500">
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-slate-500 truncate max-w-xs">{leave.reason}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold
                                ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-orange-100 text-orange-700'}`}>
                                        {leave.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400">No recent leave history found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
