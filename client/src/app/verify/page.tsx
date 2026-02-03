"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { QrCode, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function VerifyPass() {
    const searchParams = useSearchParams();
    const urlId = searchParams.get('id');
    const [qrInput, setQrInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (urlId) {
            setQrInput(urlId);
            verify(urlId);
        }
    }, [urlId]);

    const verify = async (id: string) => {
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await api.post('/features/gatepass/verify', { qrString: id });
            setResult(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!qrInput) return;
        verify(qrInput);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-slate-900 p-6 text-center">
                    <h1 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                        <QrCode className="text-teal-400" />
                        Security Scanner
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">Authorized Personnel Only</p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleVerify} className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Scan or Paste GP-ID..."
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 pl-10 font-mono text-center focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all uppercase"
                            value={qrInput}
                            onChange={(e) => setQrInput(e.target.value)}
                            autoFocus
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <button type="submit" disabled={loading} className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors">
                            {loading ? 'Verifying...' : 'VERIFY PASS'}
                        </button>
                    </form>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
                            <XCircle className="mx-auto text-red-500 mb-2" size={32} />
                            <h3 className="text-red-800 font-bold">ACCESS DENIED</h3>
                            <p className="text-red-500 text-sm">{error}</p>
                        </motion.div>
                    )}

                    {result && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-100 p-6 rounded-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-green-500 animate-pulse"></div>

                            <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
                            <h2 className="text-2xl font-bold text-green-700 mb-1">ACCESS GRANTED</h2>
                            <p className="text-green-600 text-xs uppercase font-bold tracking-widest mb-4">Valid Gate Pass</p>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-left">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xl font-bold text-slate-500 overflow-hidden">
                                        {result.student?.img ? <img src={result.student.img} className="w-full h-full object-cover" /> : result.student?.name?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{result.student?.name}</h3>
                                        <p className="text-xs text-slate-500">{result.student?.classId} | {result.student?.regNo}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Type</span>
                                        <span className="font-bold text-slate-700">{result.type}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Reason</span>
                                        <span className="font-bold text-slate-700 text-right truncate max-w-[150px]">{result.reason}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 text-teal-600 font-bold">
                                        <span className="flex items-center gap-1"><Clock size={14} /> Out Time</span>
                                        <span>{result.expectedOutTime}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-slate-400 mt-4 font-mono">ID: {result._id}</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
