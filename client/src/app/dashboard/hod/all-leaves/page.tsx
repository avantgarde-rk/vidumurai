'use client';

import HodDashboardLayout from '@/components/HodDashboardLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Search, Filter, Eye, CheckCircle, XCircle, Download } from 'lucide-react';

export default function AllLeaves() {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // ... (fetchLeaves logic remains same)

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves/pending?status=All');
            setLeaves(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleAction = async (id: string, action: string) => {
        if (!confirm(`Confirm ${action}?`)) return;
        try {
            await api.put(`/leaves/${id}/action`, { status: action });
            fetchLeaves();
        } catch (e) { alert('Action failed'); }
    };

    const filtered = leaves.filter(l => {
        const matchSearch = l.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.student?.regNo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'All' || l.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const exportPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.text('Vidumurai - Department Leave Report', 14, 20);

        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
        doc.text(`Filter Status: ${statusFilter}`, 14, 33);

        // Table
        const tableBody = filtered.map(item => [
            item.student?.name || 'N/A',
            item.student?.regNo || 'N/A',
            item.student?.classId || '-',
            item.leaveType,
            new Date(item.startDate).toLocaleDateString(),
            item.totalDays + ' Days',
            item.status
        ]);

        autoTable(doc, {
            head: [['Student Name', 'Reg No', 'Class', 'Type', 'Start Date', 'Duration', 'Status']],
            body: tableBody,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [126, 34, 206] } // Purple
        });

        doc.save(`Vidumurai_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <HodDashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Department Leaves</h2>
                    <p className="text-slate-500 text-sm">Review history and manage pending requests.</p>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={exportPDF}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md shadow-indigo-100 transition-transform active:scale-95"
                    >
                        <Download size={16} /> Export Report
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>

                    <select
                        className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm outline-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Faculty Approved">Faculty Approved</option>
                    </select>

                    {/* Search ... */}

                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            placeholder="Search student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/50 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden bg-white shadow-sm border border-slate-100">
                <table className="w-full text-left text-sm">
                    <thead className="bg-purple-50 border-b border-purple-100">
                        <tr>
                            <th className="p-4 font-semibold text-purple-900">Student</th>
                            <th className="p-4 font-semibold text-purple-900">Class</th>
                            <th className="p-4 font-semibold text-purple-900">Type</th>
                            <th className="p-4 font-semibold text-purple-900">Analysis</th>
                            <th className="p-4 font-semibold text-purple-900">Dates</th>
                            <th className="p-4 font-semibold text-purple-900">Reason</th>
                            <th className="p-4 font-semibold text-purple-900">Status</th>
                            <th className="p-4 font-semibold text-purple-900 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading records...</td></tr>
                        ) : filtered.length > 0 ? filtered.map((leave: any) => (
                            <tr key={leave._id} className="hover:bg-purple-50/50 transition-colors">
                                <td className="p-4 bg-white/50">
                                    <div className="font-bold text-slate-700">{leave.student?.name}</div>
                                    <div className="text-xs text-slate-500">{leave.student?.regNo}</div>
                                </td>
                                <td className="p-4 text-slate-600">{leave.student?.classId || 'N/A'}</td>
                                <td className="p-4">
                                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">{leave.leaveType}</span>
                                </td>
                                <td className="p-4">
                                    {/* AI Risk Badge */}
                                    {leave.riskLevel && leave.riskLevel !== 'Low' ? (
                                        <div className={`inline-flex flex-col items-center px-2 py-1 rounded-lg text-[10px] font-bold border ${leave.riskLevel === 'Critical' ? 'bg-red-50 border-red-200 text-red-600' :
                                            leave.riskLevel === 'High' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                                                'bg-amber-50 border-amber-200 text-amber-600'
                                            }`} title={leave.riskFactors?.join(', ')}>
                                            <div className="flex items-center gap-1 uppercase tracking-wider">
                                                Risk: {leave.riskLevel}
                                            </div>
                                            <div className="text-xs">{leave.riskScore}%</div>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Safe</span>
                                    )}
                                </td>
                                <td className="p-4 text-slate-600">
                                    {new Date(leave.startDate).toLocaleDateString()}
                                    <div className="text-xs text-slate-400">{leave.totalDays} Days</div>
                                </td>
                                <td className="p-4 text-slate-500 max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {(leave.status === 'Pending' || leave.status === 'Faculty Approved') ? (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(leave._id, 'Approved')}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded" title="Approve">
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(leave._id, 'Rejected')}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject">
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400">-</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={7} className="p-10 text-center text-slate-400 italic">No leaves found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </HodDashboardLayout>
    );
}
