'use client';

import HodDashboardLayout from '@/components/HodDashboardLayout';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Download, Filter, Calendar as CalendarIcon, Users } from 'lucide-react';
import * as XLSX from 'xlsx'; // Need to install xlsx for Excel export

export default function AdvancedReports() {
    const [filters, setFilters] = useState({
        classId: 'All',
        type: 'Leave',
        range: 'This Month',
        startDate: '',
        endDate: ''
    });
    const [classes, setClasses] = useState<any[]>([]);
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch Classes for Dropdown
        api.get('/users/classes').then(res => setClasses(res.data)).catch(console.error);

        // Set default dates
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        setFilters(f => ({ ...f, startDate: firstDay, endDate: lastDay }));
    }, []);

    const fetchReport = async () => {
        setLoading(true);
        try {
            // Mapping range to dates if needed, but manual dates are better
            const { data } = await api.get('/features/reports/advanced', { params: filters });
            setReportData(data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch report');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Vidumurai - ${filters.type} Report`, 14, 20);
        doc.setFontSize(10);
        doc.text(`Class: ${filters.classId} | Date: ${filters.startDate} to ${filters.endDate}`, 14, 28);

        const head = [['Date', 'Student', 'Reg No', 'Details', 'Status']];
        const body = reportData.map(row => [
            new Date(row.createdAt || row.startDate || row.eventDate).toLocaleDateString(),
            row.student?.name || '-',
            row.student?.regNo || '-',
            row.reason || row.eventName || '-',
            row.status
        ]);

        autoTable(doc, {
            head, body, startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [126, 34, 206] }
        });
        doc.save(`Report_${filters.type}_${filters.startDate}.pdf`);
    };

    return (
        <HodDashboardLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="text-purple-600" /> Advanced Reports
                    </h1>
                    <p className="text-slate-500">Generate granular reports for Leaves, ODs, and Attendance.</p>
                </div>

                {/* Filters */}
                <div className="glass-card p-6 bg-white border border-slate-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Report Type</label>
                        <select
                            className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                            value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}
                        >
                            <option value="Leave">Leaves</option>
                            <option value="OnDuty">On Duty (OD)</option>
                            {/* <option value="Attendance">Attendance</option> */}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Class</label>
                        <select
                            className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                            value={filters.classId} onChange={e => setFilters({ ...filters, classId: e.target.value })}
                        >
                            <option value="All">All Classes</option>
                            {classes.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Date Range</label>
                        <div className="flex gap-2">
                            <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                                value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
                            <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                                value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
                        </div>
                    </div>
                    <button
                        onClick={fetchReport}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <Filter size={16} /> Generate
                    </button>
                </div>

                {/* Results */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-700">Results ({reportData.length})</h3>
                        {reportData.length > 0 && (
                            <button onClick={downloadPDF} className="text-purple-600 hover:bg-purple-50 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 transition">
                                <Download size={16} /> Download PDF
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Reg No</th>
                                    <th className="p-4">Reason / Event</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-10 text-center text-slate-400">Loading data...</td></tr>
                                ) : reportData.length > 0 ? reportData.map((row: any, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50">
                                        <td className="p-4 text-slate-600">{new Date(row.createdAt || row.startDate || row.eventDate).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold text-slate-700">{row.student?.name || 'Unknown'}</td>
                                        <td className="p-4 text-mono text-slate-500">{row.student?.regNo || '-'}</td>
                                        <td className="p-4 text-slate-600 max-w-xs truncate" title={row.reason || row.eventName}>{row.reason || row.eventName}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    row.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">No records found for selected criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </HodDashboardLayout>
    );
}
