'use client';

import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { MessageSquare, Phone, CheckCircle, Clock } from 'lucide-react';

export default function CommunicationLogs() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await api.get('/features/reports/logs');
                setLogs(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <AdminDashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="text-green-600" /> Communication Center
                </h1>
                <p className="text-slate-500">Live feed of automated WhatsApp/SMS alerts sent to parents.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-700">Student</th>
                                <th className="p-4 font-semibold text-slate-700">Recipient</th>
                                <th className="p-4 font-semibold text-slate-700">Message Content</th>
                                <th className="p-4 font-semibold text-slate-700">Type</th>
                                <th className="p-4 font-semibold text-slate-700">Status</th>
                                <th className="p-4 font-semibold text-slate-700">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading logs...</td></tr>
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-700">{log.student?.name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{log.student?.regNo}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 font-mono text-xs text-slate-600">
                                                <Phone size={12} /> {log.recipientMobile}
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-sm">
                                            <div className="bg-green-50 text-green-800 p-2 rounded-lg text-xs leading-relaxed border border-green-100">
                                                {log.message}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600">{log.type}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                                <CheckCircle size={12} /> {log.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(log.sentAt).toLocaleString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">No messages sent yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
