'use client';

import HodDashboardLayout from '@/components/HodDashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

import { useRouter } from 'next/navigation';

export default function ClassAnalytics() {
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users/classes')
            .then(res => {
                // Map API classes to analytics format
                // In a real app, we'd fetch specific analytics stats. 
                // For now, derive from class list (Student Count) and default others (0 leaves)
                const chartData = res.data.map((cls: any) => ({
                    id: cls._id, // Capture ID for navigation
                    name: cls.name,
                    attendance: cls.studentCount > 0 ? 100 : 0,
                    leaves: 0,
                    strength: cls.studentCount
                }));
                setData(chartData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <HodDashboardLayout>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Class Analytics</h2>
                <p className="text-slate-500 text-sm">Real-time analysis of class performance and strength.</p>
            </div>

            {loading ? <div className="p-10 text-center text-slate-500">Loading analytics...</div> : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="glass-card p-6 bg-white border border-slate-100">
                            <h3 className="text-lg font-bold text-purple-900 mb-6">Attendance Performance (%)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                                    <Tooltip
                                        cursor={{ fill: '#f3e8ff' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="attendance" fill="#7e22ce" radius={[4, 4, 0, 0]} barSize={30} name="Attendance %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="glass-card p-6 bg-white border border-slate-100">
                            <h3 className="text-lg font-bold text-purple-900 mb-6">Leave Frequency (Count)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: '#fff7ed' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="leaves" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={30} name="Total Leaves" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card bg-white border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-purple-900 mb-4">Detailed Class Report</h3>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-purple-50 border-b border-purple-100">
                                <tr>
                                    <th className="p-3 font-semibold text-purple-900">Class Section</th>
                                    <th className="p-3 font-semibold text-purple-900">Total Strength</th>
                                    <th className="p-3 font-semibold text-purple-900">Avg Attendance</th>
                                    <th className="p-3 font-semibold text-purple-900">Total Leaves</th>
                                    <th className="p-3 font-semibold text-purple-900">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.length > 0 ? data.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
                                        <td className="p-3 font-medium text-slate-700">{item.name}</td>
                                        <td className="p-3 text-slate-500">{item.strength}</td>
                                        <td className="p-3">
                                            <span className={`font-bold ${item.attendance < 80 ? 'text-red-500' : 'text-green-600'}`}>
                                                {item.attendance}%
                                            </span>
                                        </td>
                                        <td className="p-3 text-slate-500">{item.leaves}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => router.push(`/dashboard/faculty/classes?classId=${item.id}`)}
                                                className="text-xs text-purple-600 hover:underline font-bold"
                                            >
                                                View Students
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="p-6 text-center text-slate-400">No classes found. Add classes to see analytics.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </HodDashboardLayout>
    );
}
