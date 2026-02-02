'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, MapPin, QrCode, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

export default function StudentGatePass() {
    const [passes, setPasses] = useState<any[]>([]);
    const [isApplying, setIsApplying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        type: 'Local',
        reason: '',
        destination: '',
        outTime: '',
        inTime: ''
    });

    useEffect(() => { fetchPasses(); }, []);

    const fetchPasses = async () => {
        try {
            const res = await api.get('/features/gatepass');
            setPasses(res.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/features/gatepass', form);
            alert('Gate Pass Requested Successfully!');
            setIsApplying(false);
            fetchPasses();
        } catch (err: any) {
            alert('Error: ' + err.response?.data?.error || err.message);
        }
    };

    // QR Code Placeholder
    const QRCodeView = ({ pass }: { pass: any }) => {
        const [origin, setOrigin] = useState('');
        useEffect(() => { setOrigin(window.location.origin); }, []);

        // Online Verification Link
        const qrUrl = pass.status === 'Approved'
            ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${origin}/verify?id=${pass.qrCodeString}`)}`
            : '';

        return (
            <div className="bg-white p-2 rounded-xl shadow-inner border border-slate-100 flex flex-col items-center justify-center text-center">
                <div className={`p-1 rounded-lg ${pass.status === 'Approved' ? 'bg-white' : 'bg-slate-100'} overflow-hidden`}>
                    {pass.status === 'Approved' && origin ? (
                        <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                    ) : (
                        <QrCode size={80} className="text-slate-300" />
                    )}
                </div>
                {pass.status === 'Approved' ? (
                    <div className="mt-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest">{pass.qrCodeString.slice(-8)}</div>
                ) : (
                    <div className="mt-2 text-[10px] text-orange-500 font-bold flex items-center gap-1">
                        <Clock size={12} /> {pass.status}
                    </div>
                )}
                {/* Debug Helper for Development */}
                <p className="text-[8px] text-slate-300 mt-1 max-w-[100px] truncate">{origin}</p>
            </div>
        );
    };

    return (
        <DashboardLayout role="Student">
            <div className="p-6 max-w-5xl mx-auto font-sans">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gate Pass</h1>
                        <p className="text-slate-500 font-medium">Digital Campus Exit Authorization</p>
                    </div>
                    <button
                        onClick={() => setIsApplying(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} /> Request Pass
                    </button>
                </div>

                {isApplying && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-10 bg-white p-8 rounded-3xl shadow-2xl border border-indigo-50 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        <h3 className="font-bold text-xl mb-6 text-slate-800 flex items-center gap-2">
                            <MapPin className="text-indigo-600" /> New Request
                        </h3>
                        {/* Form code same as before, simplified for this snippet */}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ... (Existing inputs but with enhanced styling) ... */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</label>
                                <select
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                                    value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                >
                                    <option value="Local">Local (Town)</option>
                                    <option value="Outstation">Outstation (Home)</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</label>
                                <input
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                    placeholder="e.g. Bus Stand"
                                    required value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</label>
                                <textarea
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                    placeholder="Brief reason..." rows={2} required
                                    value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Out</label>
                                <input type="datetime-local" className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none"
                                    required value={form.outTime} onChange={e => setForm({ ...form, outTime: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected In</label>
                                <input type="datetime-local" className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none"
                                    required value={form.inTime} onChange={e => setForm({ ...form, inTime: e.target.value })} />
                            </div>
                            <div className="md:col-span-2 flex gap-4 mt-2">
                                <button type="button" onClick={() => setIsApplying(false)} className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-300 transition-all transform hover:-translate-y-1">Submit Request</button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {loading ? <div className="text-center py-20 text-slate-400 animate-pulse">Loading Passes...</div> : (
                    <div className="space-y-8">
                        {/* Active/Approved Passes First */}
                        {passes.filter(p => p.status === 'Approved').map(pass => (
                            <motion.div
                                key={pass._id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-100 relative group"
                            >
                                {/* Live Hologram Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_2.5s_infinite]"></div>

                                <div className="bg-green-600 text-white p-4 flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-2 font-bold tracking-widest uppercase text-sm">
                                        <CheckCircle className="text-white" size={18} />
                                        Approved Gate Pass
                                    </div>
                                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-mono backdrop-blur-sm">
                                        {pass.qrCodeString.slice(-8)}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-stretch">
                                    <div className="flex-1 space-y-6 w-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-4xl font-black text-slate-800 mb-1">{pass.destination}</h2>
                                                <p className="text-lg text-slate-500 font-medium">{pass.reason}</p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider ${pass.type === 'Emergency' ? 'bg-red-100 text-red-700' : 'bg-indigo-50 text-indigo-700'
                                                }`}>
                                                {pass.type}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase">Leaving</label>
                                                <p className="text-lg font-bold text-slate-700">
                                                    {new Date(pass.expectedOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-xs text-slate-500">{new Date(pass.expectedOutTime).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase">Returning</label>
                                                <p className="text-lg font-bold text-slate-700">
                                                    {new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-xs text-slate-500">{new Date(pass.expectedInTime).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Valid QR Section */}
                                    <div className="w-full md:w-64 bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
                                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                                        <QRCodeView pass={pass} />
                                        <p className="text-xs text-slate-400 mt-4 font-mono">Scan to Verify</p>
                                        <div className="mt-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Live Valid
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Recent History / Pending */}
                        <div className="mt-12">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Request History</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {passes.filter(p => p.status !== 'Approved').map(pass => (
                                    <div key={pass._id} className="bg-white p-6 rounded-2xl border border-slate-200 opacity-75 hover:opacity-100 transition-opacity">
                                        <div className="flex justify-between mb-4">
                                            <span className="font-bold text-slate-700">{pass.destination}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${pass.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                }`}>{pass.status}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 space-y-1">
                                            <p>Type: {pass.type}</p>
                                            <p>Date: {new Date(pass.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
