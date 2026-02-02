'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera, ShieldCheck, Briefcase } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function StudentProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<any>({});
    const [editForm, setEditForm] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auth/me').then(res => {
            setUser(res.data);
            setEditForm(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    const handleChange = (e: any) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const changes: any = {};
        let hasChanges = false;

        // Check all fields
        // Check all fields
        const fields = ['name', 'email', 'phone', 'parentMobile', 'address', 'semester', 'classId', 'regNo'];
        fields.forEach(field => {
            if (editForm[field] !== user[field]) {
                changes[field] = `${user[field] || ''} -> ${editForm[field]}`;
                hasChanges = true;
            }
        });

        if (editForm.profilePic !== user.profilePic) {
            changes.profilePic = "Profile Picture Update";
            hasChanges = true;
        }

        if (!hasChanges) {
            alert("No changes detected.");
            setIsEditing(false);
            return;
        }

        try {
            await api.post('/users/profile-request', {
                details: editForm,
                changes: changes,
                reason: 'Student self-update request'
            });
            alert('Profile update request sent to Mentor!');
            setIsEditing(false);
        } catch (err: any) {
            alert('Failed to send request: ' + err.message);
        }
    };

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("File too large. Max 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setEditForm({ ...editForm, profilePic: base64String });
            setIsEditing(true);
        };
        reader.readAsDataURL(file);
    };

    if (loading) return <DashboardLayout role="Student"><div className="p-20 text-center animate-pulse text-purple-600 font-medium">Loading Profile...</div></DashboardLayout>;

    return (
        <DashboardLayout role="Student">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Left Sidebar (Avatar & Basic Info) */}
                        <div className="md:w-1/3 bg-slate-50 p-8 flex flex-col items-center border-r border-slate-100">
                            <div className="relative mb-6 group">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 p-1 shadow-inner">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-purple-700 uppercase overflow-hidden">
                                        {editForm.profilePic || user.profilePic ? (
                                            <img src={editForm.profilePic || user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user.name?.[0]
                                        )}
                                    </div>
                                </div>
                                <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition cursor-pointer">
                                    <Camera size={16} />
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={!isEditing && false} />
                                </label>
                            </div>

                            {/* Name Input */}
                            {isEditing ? (
                                <input
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleChange}
                                    className="text-xl font-bold text-slate-800 text-center bg-white border border-purple-300 rounded p-1 mb-2 w-full"
                                    placeholder="Full Name"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-slate-800 text-center">{user.name}</h2>
                            )}

                            {/* RegNo Input */}
                            {isEditing ? (
                                <input
                                    name="regNo"
                                    value={editForm.regNo}
                                    onChange={handleChange}
                                    className="text-sm text-slate-500 mb-6 font-mono text-center bg-white border border-purple-300 rounded p-1 w-full"
                                    placeholder="Reg No"
                                />
                            ) : (
                                <p className="text-sm text-slate-500 mb-6 font-mono">{user.regNo}</p>
                            )}

                            <div className="w-full space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Sem</span>
                                    {isEditing ? (
                                        <input name="semester" value={editForm.semester} onChange={handleChange} className="w-16 text-right font-bold text-slate-700 border-b border-purple-300 outline-none" />
                                    ) : (
                                        <span className="font-bold text-slate-700">{user.semester || 'IV'}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Class</span>
                                    {isEditing ? (
                                        <input name="classId" value={editForm.classId} onChange={handleChange} className="w-24 text-right font-bold text-slate-700 border-b border-purple-300 outline-none" />
                                    ) : (
                                        <span className="font-bold text-slate-700">{user.classId || 'N/A'}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Content (Details Form) */}
                        <div className="md:w-2/3 p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                    <Briefcase size={20} className="text-purple-500" />
                                    Academic & Personal Details
                                </h3>

                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition"
                                    >
                                        <Edit2 size={16} /> Edit Details
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center gap-2 text-sm font-semibold text-white bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 shadow-lg shadow-purple-200 transition"
                                        >
                                            <Save size={16} /> Request Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-purple-400 ring-2 ring-purple-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <Mail size={18} className="text-slate-400" />
                                        {isEditing ? (
                                            <input name="email" value={editForm.email} onChange={handleChange} className="w-full bg-transparent outline-none text-sm font-medium text-slate-700" />
                                        ) : (
                                            <span className="text-sm font-medium text-slate-500">{user.email}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Phone Number</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-purple-400 ring-2 ring-purple-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <Phone size={18} className={isEditing ? 'text-purple-600' : 'text-slate-400'} />
                                        {isEditing ? (
                                            <input
                                                name="phone"
                                                value={editForm.phone || ''}
                                                onChange={handleChange}
                                                className="w-full bg-transparent outline-none text-sm font-medium text-slate-700"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-slate-700">{user.phone || 'N/A'}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Parent Mobile - Critical for alerts */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Parent Mobile (Alerts)</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-purple-400 ring-2 ring-purple-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <ShieldCheck size={18} className={isEditing ? 'text-purple-600' : 'text-slate-400'} />
                                        {isEditing ? (
                                            <input
                                                name="parentMobile"
                                                value={editForm.parentMobile || ''}
                                                onChange={handleChange}
                                                className="w-full bg-transparent outline-none text-sm font-medium text-slate-700"
                                                placeholder="Parent's Number"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-slate-700">{user.parentMobile || 'Not Set'}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Address (Full Width) */}
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Residential Address</label>
                                    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-purple-400 ring-2 ring-purple-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <MapPin size={18} className={`mt-0.5 ${isEditing ? 'text-purple-600' : 'text-slate-400'}`} />
                                        {isEditing ? (
                                            <textarea
                                                name="address"
                                                value={editForm.address || ''}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full bg-transparent outline-none text-sm font-medium text-slate-700 resize-none"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-slate-700">{user.address || 'N/A'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status Footer */}
                            {user.profileUpdateRequest?.status === 'Pending' && (
                                <div className="mt-8 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                    <p className="text-sm text-amber-800 font-medium">
                                        Your profile update request is pending Mentor approval.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
