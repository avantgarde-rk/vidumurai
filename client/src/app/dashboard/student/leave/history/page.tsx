'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { ClipboardList, Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function LeaveHistory() {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeaves = leaves.filter((leave: any) =>
        leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        api.get('/leaves')
            .then(res => setLeaves(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="Student">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <ClipboardList className="text-blue-500" />
                    My Leave History
                </h2>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search history (e.g. NPTEL)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden bg-white"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-purple-50 border-b border-purple-100">
                            <tr>
                                <th className="p-4 font-semibold text-purple-900">Applied On</th>
                                <th className="p-4 font-semibold text-purple-900">Type</th>
                                <th className="p-4 font-semibold text-purple-900">Duration</th>
                                <th className="p-4 font-semibold text-purple-900">Reason</th>
                                <th className="p-4 font-semibold text-purple-900">Status</th>
                                <th className="p-4 font-semibold text-purple-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading records...</td></tr>
                            ) : filteredLeaves.length > 0 ? (
                                filteredLeaves.map((leave: any) => (
                                    <tr key={leave._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-slate-500">{new Date(leave.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium">{leave.leaveType}</td>
                                        <td className="p-4 text-slate-500">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                                                {leave.totalDays} Days
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 max-w-xs truncate">{leave.reason}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold
                                    ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-blue-600 hover:text-blue-700 font-medium text-xs">View Details</button>
                                        </td>
                                    </tr>
                                ))) : (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No leave history found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
