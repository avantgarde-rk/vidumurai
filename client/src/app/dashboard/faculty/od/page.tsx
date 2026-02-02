'use client';

import { useState, useEffect } from 'react';
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import HodDashboardLayout from '@/components/HodDashboardLayout';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Check, X, Clock, MapPin, Calendar, FileText, Award, Eye } from 'lucide-react';

export default function FacultyOD() {
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
            const { data } = await api.get('/features/od');
            setRequests(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'Approve' | 'Reject', reason?: string) => {
        try {
            await api.put(`/features/od/${id}/action`, { action, reason });
            fetchRequests();
            alert(`OD Request ${action}d!`);
        } catch (err: any) { alert(err.message); }
    };

    const handleVerify = async (id: string) => {
        try {
            await api.put(`/features/od/${id}/verify`);
            fetchRequests();
            alert('Certificate Verified!');
        } catch (err: any) { alert(err.message); }
    };

    // Helper to view base64/url
    const viewFile = (file: string) => {
        const win = window.open();
        if (win) {
            win.document.write(`<iframe src="${file}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        }
    };

    const ODCard = ({ req }: { req: any }) => {
        const [isRejecting, setIsRejecting] = useState(false);
        const [rejectReason, setRejectReason] = useState('');

        const isPending = req.status === 'Pending';
        const isProofSubmitted = req.status === 'Proof-Submitted';

        const submitReject = () => {
            if (!rejectReason) return alert('Reason required');
            handleAction(req._id, 'Reject', rejectReason);
        };

        return (
            <motion.div
                layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-6"
            >
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider">
                            On Duty
                        </span>
                        <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                        <div className={`text-xs font-bold px-2 py-0.5 rounded border ${req.status === 'Fully-Verified' ? 'border-green-200 text-green-600 bg-green-50' :
                            req.status === 'Rejected' ? 'border-red-200 text-red-600 bg-red-50' :
                                'border-amber-200 text-amber-600 bg-amber-50'
                            }`}>
                            {req.status}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{req.eventName}</h3>
                        <div className="text-sm font-semibold text-slate-500">{req.student?.name} ({req.student?.regNo})</div>
                        <p className="text-slate-400 text-xs mt-1">{req.organizer}</p>
                    </div>

                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(req.eventDate).toLocaleDateString()}</div>
                        {req.initialBrochure && (
                            <button onClick={() => viewFile(req.initialBrochure)} className="flex items-center gap-1 text-indigo-500 hover:underline">
                                <FileText size={14} /> View Brochure
                            </button>
                        )}
                        {req.completionCertificate && (
                            <button onClick={() => viewFile(req.completionCertificate)} className="flex items-center gap-1 text-green-600 hover:underline">
                                <Award size={14} /> View Certificate
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-2 min-w-[160px]">
                    {isPending || (req.status === 'Pre-Approved' && user.role === 'hod') ? (
                        isRejecting ? (
                            <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="text-xs p-2 rounded border w-full" placeholder="Reason..." />
                                <div className="flex gap-2">
                                    <button onClick={submitReject} className="bg-red-500 text-white text-xs py-1 px-2 rounded">Confirm</button>
                                    <button onClick={() => setIsRejecting(false)} className="bg-slate-200 text-xs py-1 px-2 rounded">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => handleAction(req._id, 'Approve')} className="w-full py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Check size={16} /> {req.status === 'Pre-Approved' ? 'Final Approve' : 'Pre-Approve'}
                                </button>
                                <button onClick={() => setIsRejecting(true)} className="w-full py-1.5 px-4 bg-white border border-red-100 hover:text-red-600 text-slate-500 text-sm rounded-xl font-bold flex items-center justify-center gap-2">
                                    <X size={16} /> Reject
                                </button>
                            </>
                        )
                    ) : isProofSubmitted ? (
                        <button onClick={() => handleVerify(req._id)} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl font-bold flex items-center justify-center gap-2">
                            <Award size={16} /> Verify Cert
                        </button>
                    ) : (
                        <div className="text-center p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs font-bold text-slate-400">
                            {req.status === 'Pre-Approved' ? 'Awaiting Proof' : req.status}
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
                    <h1 className="text-3xl font-bold text-slate-800">On Duty Requests</h1>
                    <p className="text-slate-500">Manage OD applications and verification</p>
                </div>
                {loading ? <div>Loading...</div> : (
                    <div className="space-y-4">
                        {requests.map(req => <ODCard key={req._id} req={req} />)}
                    </div>
                )}
            </div>
        </Layout>
    );
}
