'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, MapPin, FileText, Upload, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

export default function StudentOD() {
    const [ods, setOds] = useState<any[]>([]);
    const [isApplying, setIsApplying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [form, setForm] = useState({
        eventName: '',
        eventDate: '',
        organizer: '',
        description: '',
        brochure: '' // Base64
    });
    const [uploadModal, setUploadModal] = useState<string | null>(null);
    const [certFile, setCertFile] = useState<string>('');
    const [certPreview, setCertPreview] = useState<string>('');

    const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertFile(reader.result as string);
                setCertPreview(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitCert = async () => {
        if (!uploadModal || !certFile) return;
        try {
            await api.put(`/features/od/${uploadModal}/certificate`, { certificate: certFile });
            alert('Certificate Uploaded Successfully!');
            setUploadModal(null);
            setCertFile('');
            setCertPreview('');
            fetchODs();
        } catch (err: any) { alert(err.message); }
    };

    useEffect(() => { fetchODs(); }, []);

    const fetchODs = async () => {
        try {
            const res = await api.get('/features/od');
            setOds(res.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, brochure: reader.result as string });
                setFilePreview(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/features/od', form);
            alert('OD Requested Successfully!');
            setIsApplying(false);
            setForm({ eventName: '', eventDate: '', organizer: '', description: '', brochure: '' });
            setFilePreview(null);
            fetchODs();
        } catch (err: any) {
            alert('Error: ' + err.response?.data?.error || err.message);
        }
    };

    return (
        <DashboardLayout role="Student">
            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">On-Duty Requests</h1>
                        <p className="text-slate-500">Apply for ODs for events, symposiums, and hackathons</p>
                    </div>
                    <button
                        onClick={() => setIsApplying(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                    >
                        <Plus size={20} /> Apply OD
                    </button>
                </div>

                {isApplying && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-8 bg-white p-6 rounded-2xl shadow-xl border border-indigo-50"
                    >
                        <h3 className="font-bold text-lg mb-4 text-indigo-900">New On-Duty Application</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Event Name</label>
                                <input
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                                    placeholder="e.g. National Hackathon 2024"
                                    required
                                    value={form.eventName} onChange={e => setForm({ ...form, eventName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Organizer / College</label>
                                <input
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. IIT Madras"
                                    required
                                    value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Event Date</label>
                                <input type="date" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                                    required value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                <textarea
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Brief details about the event context..."
                                    rows={2} required
                                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Upload Brochure/Proof</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-indigo-400 transition-colors cursor-pointer relative">
                                    <input type="file" required onChange={handleFileChange} accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <Upload size={32} className="text-slate-400 mb-2" />
                                    {filePreview ? (
                                        <span className="text-indigo-600 font-bold flex items-center gap-2"><CheckCircle size={16} /> {filePreview}</span>
                                    ) : (
                                        <span className="text-slate-500 text-sm">Click to upload Brochure (Image/PDF)</span>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2 flex gap-3 mt-2">
                                <button type="button" onClick={() => setIsApplying(false)} className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-md">Submit Application</button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {loading ? <div className="text-center py-10 animate-pulse text-indigo-400">Loading requests...</div> : (
                    <div className="grid grid-cols-1 gap-4">
                        {ods.map(od => (
                            <motion.div
                                key={od._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-slate-800 text-lg">{od.eventName}</h3>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${od.status === 'Fully-Verified' ? 'bg-green-100 text-green-700' :
                                                od.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    od.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-blue-50 text-blue-600'
                                            }`}>
                                            {od.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-1 font-medium">{od.organizer}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                                        <div className="flex items-center gap-1"><Calendar size={12} /> {new Date(od.eventDate).toLocaleDateString()}</div>
                                        {od.initialBrochure && <div onClick={() => { const win = window.open(); win?.document.write(`<iframe src="${od.initialBrochure}" style="width:100%;height:100%"/>`) }} className="flex items-center gap-1 text-indigo-500 cursor-pointer hover:underline"><FileText size={12} /> View Proof</div>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {od.status === 'Pre-Approved' && (
                                        <button
                                            onClick={() => setUploadModal(od._id)}
                                            className="text-xs font-bold text-white bg-green-500 px-3 py-2 rounded-lg shadow-green-200 shadow hover:bg-green-600 transition-colors flex items-center gap-2"
                                        >
                                            <Upload size={14} /> Upload Cert
                                        </button>
                                    )}
                                    {od.status === 'Proof-Submitted' && <span className="text-xs font-bold text-slate-400">Verifying...</span>}
                                    {od.status === 'Fully-Verified' && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Verified</span>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Upload Modal */}
                {uploadModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                            <h3 className="text-xl font-bold mb-4 text-slate-800">Upload Certificate</h3>
                            <p className="text-sm text-slate-500 mb-4">Please upload your participation or winner certificate to verify your OD.</p>

                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-indigo-400 transition-colors cursor-pointer relative mb-6">
                                <input type="file" onChange={handleCertChange} accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                                <Upload size={32} className="text-slate-400 mb-2" />
                                {certPreview ? (
                                    <span className="text-indigo-600 font-bold flex items-center gap-2"><CheckCircle size={16} /> {certPreview}</span>
                                ) : (
                                    <span className="text-slate-500 text-sm">Upload File (Image/PDF)</span>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setUploadModal(null)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold">Cancel</button>
                                <button onClick={submitCert} disabled={!certFile} className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50">Submit</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
