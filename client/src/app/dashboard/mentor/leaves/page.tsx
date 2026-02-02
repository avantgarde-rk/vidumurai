'use client';

import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MentorLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchLeaves = () => {
        api.get('/leaves/pending')
            .then(res => setLeaves(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleAction = async (id: string, status: string) => {
        if (!confirm(`Are you sure you want to ${status} this leave?`)) return;
        setActionLoading(id);
        try {
            await api.put(`/leaves/${id}/action`, {
                status,
                remarks: status === 'Approved' ? 'Approved by Mentor' : 'Rejected by Mentor due to insufficient reason.'
            });
            fetchLeaves(); // Refresh
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <MentorDashboardLayout>
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Leave Requests</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaves.length > 0 ? leaves.map((leave: any) => (
                    <motion.div
                        key={leave._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-6 bg-white dark:bg-slate-900 flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600">
                                    {leave.student?.name?.[0]}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-white">{leave.student?.name}</h4>
                                    <p className="text-xs text-slate-500">{leave.student?.rollNo} | {leave.student?.department}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                                {leave.leaveType}
                            </span>
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Duration:</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {leave.totalDays} Days ({new Date(leave.startDate).toLocaleDateString()})
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="text-slate-500 block mb-1">Reason:</span>
                                <p className="p-3 bg-purple-50 rounded-lg text-slate-700 text-sm leading-relaxed border border-purple-100">
                                    {leave.reason}
                                </p>
                            </div>

                            {leave.leaveType === 'On-Duty' && (
                                <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg text-xs text-blue-800">
                                    <p className="font-bold mb-2 flex items-center justify-between">
                                        OD Verification:
                                        {leave.isFreeRun && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase">Good to Go</span>}
                                    </p>

                                    {leave.odProof ? (
                                        <a
                                            href={leave.odProof}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full block text-center bg-white border border-blue-300 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded transition-colors font-semibold"
                                        >
                                            View Attached Proof (PDF/Img)
                                        </a>
                                    ) : (
                                        <div className="text-slate-400 italic text-center py-1">No proof attached yet</div>
                                    )}
                                </div>
                            )}

                            {/* AI Analysis */}
                            <div className="p-3 border border-purple-200 bg-white rounded-lg text-xs text-slate-600 flex flex-col gap-1 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">AI Insight</span>
                                    {/* Removed Standard Priority text as requested */}
                                </div>
                                <p className="opacity-90 leading-relaxed">
                                    {(() => {
                                        const r = leave.reason.toLowerCase();
                                        const meaningful = r.length > 15 && (r.includes('sick') || r.includes('fever') || r.includes('pain') || r.includes('urgent') || r.includes('family') || r.includes('marriage') || r.includes('function') || r.includes('hackathon') || r.includes('symposium'));

                                        return meaningful
                                            ? <span className="text-green-700 font-semibold">Reason appears detailed and contextually valid.</span>
                                            : <span className="text-amber-600 font-semibold">Reason is brief or vague; verification recommended.</span>;
                                    })()}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-auto">
                            <button
                                onClick={() => handleAction(leave._id, 'Approved')}
                                disabled={actionLoading === leave._id}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <CheckCircle size={16} />
                                Approve
                            </button>
                            <button
                                onClick={() => handleAction(leave._id, 'Rejected')}
                                disabled={actionLoading === leave._id}
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <XCircle size={16} />
                                Reject
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-3 text-center py-12 text-slate-400">
                        No pending requests found. Good job! 🎉
                    </div>
                )}
            </div>
        </MentorDashboardLayout>
    );
}
