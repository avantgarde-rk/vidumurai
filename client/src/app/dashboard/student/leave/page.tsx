'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar as CalendarIcon, Send } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ApplyLeave() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        leaveType: 'Sick',
        startDate: '',
        endDate: '',
        reason: '',
        isFreeRun: false,
        odProof: ''
    });
    const [aiLoading, setAiLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('File too large (Max 2MB)');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, odProof: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleAiGenerate = () => {
        setAiLoading(true);
        // Simulate AI delay
        setTimeout(() => {
            const suggestions = [
                "I am suffering from a high fever and severe headache, and the doctor has advised me to take rest for a few days.",
                "I have an urgent family function to attend which requires my presence.",
                "I need to attend a medical appointment regarding a recurring health issue."
            ];
            // Pick a random one based on type roughly
            const suggestion = formData.leaveType === 'Sick' ? suggestions[0] : suggestions[1];
            setFormData({ ...formData, reason: suggestion });
            setAiLoading(false);
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/leaves', formData);
            router.push('/dashboard/student');
        } catch (err: any) {
            alert('Failed to apply leave: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout role="Student">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="text-blue-500" />
                    Apply for Leave
                </h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 bg-white"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Leave Type */}
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">Leave Type</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Sick', 'Casual', 'Emergency'].map((type) => (
                                    <div key={type} className="relative">
                                        <input
                                            type="radio"
                                            name="leaveType"
                                            value={type}
                                            id={type}
                                            checked={formData.leaveType === type}
                                            onChange={handleChange}
                                            className="peer sr-only"
                                        />
                                        <label
                                            htmlFor={type}
                                            className="flex items-center justify-center p-3 border border-slate-200 rounded-xl cursor-pointer transition-all peer-checked:border-purple-500 peer-checked:bg-purple-50 peer-checked:text-purple-700 font-medium text-slate-500 hover:bg-slate-50"
                                        >
                                            {type}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-700 font-medium mb-2">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium mb-2">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">Reason</label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="State your reason clearly..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 transform active:scale-95"
                            >
                                {submitting ? 'Submitting...' : (
                                    <>
                                        <Send size={18} />
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
