'use client';

import { useState, useEffect } from 'react';
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import HodDashboardLayout from '@/components/HodDashboardLayout';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Check, X, Clock, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function FacultyGatePass() {
    const [user, setUser] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchRequests();
        }
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/features/gatepass');
            setRequests(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'Approve' | 'Reject', reasonStr?: string) => {
        try {
            await api.put(`/features/gatepass/${id}`, { action, reason: reasonStr });
            // Optimistic update
            fetchRequests();
            alert(`Request ${action}d!`);
        } catch (err: any) {
            alert('Action failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const GatePassCard = ({ req }: { req: any }) => {
        const [isRejecting, setIsRejecting] = useState(false);
        const [rejectReason, setRejectReason] = useState('');

        const userRole = user?.role?.toLowerCase();
        const isMentor = userRole === 'mentor';
        const isHod = userRole === 'hod';

        const canAct = (isMentor && (req.status === 'Pending' || (req.status && req.status.includes('Pending Mentor')))) ||
            (isHod && req.status && req.status.includes('Pending HOD'));

        const submitReject = () => {
            if (!rejectReason.trim()) return alert('Please provide a reason');
            handleAction(req._id, 'Reject', rejectReason);
            setIsRejecting(false);
            setRejectReason(''); // Clear reason after submission
        };

        return (
            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-6"
            >
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${req.type === 'Emergency' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                            {req.type}
                        </span>
                        <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                        <div className={`text-xs font-bold px-2 py-0.5 rounded border ${req.status.includes('Approved') || req.status === 'Approved' ? 'border-green-200 text-green-600 bg-green-50' :
                            req.status.includes('Rejected') ? 'border-red-200 text-red-600 bg-red-50' :
                                'border-amber-200 text-amber-600 bg-amber-50'
                            }`}>
                            {req.status}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{req.student?.name} <span className="text-slate-400 font-normal text-sm">({req.student?.regNo})</span></h3>
                        <p className="text-slate-500 text-sm mt-1">{req.reason}</p>
                    </div>

                    <div className="flex gap-6 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg w-max">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-purple-500" />
                            <span className="font-bold">{req.destination}</span>
                        </div>
                        <div className="w-px bg-slate-300"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Out:</span>
                            <span>{new Date(req.expectedOutTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center gap-2 min-w-[160px]">
                    {isRejecting ? (
                        <div className="flex flex-col gap-2 animate-fade-in bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <textarea
                                className="text-xs p-2 rounded-lg border border-slate-300 w-full focus:ring-2 focus:ring-red-200 outline-none"
                                placeholder="Reason for rejection..."
                                rows={2}
                                autoFocus
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button onClick={submitReject} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 rounded-lg">Confirm</button>
                                <button onClick={() => { setIsRejecting(false); setRejectReason(''); }} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-bold py-1.5 rounded-lg">Cancel</button>
                            </div>
                        </div>
                    ) : canAct ? (
                        <>
                            <button
                                onClick={() => handleAction(req._id, 'Approve')}
                                className="w-full py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <Check size={16} />
                                {isMentor ? 'Forward' : 'Sanction'}
                            </button>
                            <button
                                onClick={() => setIsRejecting(true)}
                                className="w-full py-1.5 px-4 bg-white border border-red-100 hover:border-red-200 hover:bg-red-50 text-red-600 text-sm rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <X size={16} />
                                Reject
                            </button>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <span className="text-xs text-slate-400 font-bold uppercase">
                                {req.status === 'Approved' ? 'Sanctioned' :
                                    req.status === 'Rejected' ? 'Rejected' :
                                        'Awaiting Action'}
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    if (!user) return null;

    const Layout = user.role === 'hod' ? HodDashboardLayout : MentorDashboardLayout;

    return (
        <Layout>
            <div className="p-8 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Gate Pass Requests</h1>
                    <p className="text-slate-500">Manage student exit permissions</p>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="inline-flex p-4 bg-purple-50 rounded-full text-purple-300 mb-4">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600">No Pending Requests</h3>
                        <p className="text-slate-400">All gate pass requests have been processed.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Filter tabs could go here */}
                        {requests.map(req => <GatePassCard key={req._id} req={req} />)}
                    </div>
                )}
            </div>
        </Layout>
    );
}
