'use client';

import HodDashboardLayout from '@/components/HodDashboardLayout';
import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import api from '@/lib/api';

export default function HodProfileRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users/profile-requests')
            .then(res => setRequests(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleAction = async (id: string, action: 'Approve' | 'Reject') => {
        if (!confirm(`${action} this request?`)) return;
        try {
            await api.put(`/users/profile-requests/${id}`, { action });
            alert(`Request ${action}d!`);
            setRequests(requests.filter(r => r.id !== id));
        } catch (err: any) {
            alert('Action failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <HodDashboardLayout>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Profile Update Requests</h2>

            {loading ? <div className="p-10 text-center">Loading...</div> : (
                <div className="grid gap-4">
                    {requests.map((req: any) => (
                        <div key={req.id} className="glass-card p-6 bg-white flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800">{req.student}</h3>
                                <p className="text-sm text-slate-500 mt-1">Requesting to change:</p>
                                <div className="mt-1 space-y-1">
                                    {/* The backend sends 'changes' object: { phone: "old -> new" } */}
                                    {Object.entries(req.changes || {}).map(([k, v]) => (
                                        <code key={k} className="block bg-purple-50 p-2 rounded text-sm text-purple-700 font-mono border border-purple-100">
                                            <span className="font-bold uppercase text-xs text-purple-400 mr-2">{k}:</span>
                                            {String(v)}
                                        </code>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Reason: {req.reason}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleAction(req.id, 'Approve')} className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition">
                                    <Check size={20} />
                                </button>
                                <button onClick={() => handleAction(req.id, 'Reject')} className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200 transition">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {requests.length === 0 && (
                        <p className="text-center text-slate-400 py-10">No pending profile modification requests.</p>
                    )}
                </div>
            )}
        </HodDashboardLayout>
    );
}
