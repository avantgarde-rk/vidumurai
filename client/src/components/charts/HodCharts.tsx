'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const attendanceData = [
    { name: 'Mon', present: 85 },
    { name: 'Tue', present: 88 },
    { name: 'Wed', present: 92 },
    { name: 'Thu', present: 90 },
    { name: 'Fri', present: 86 },
];

export const DepartmentAttendanceChart = () => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                    cursor={{ fill: '#f3e8ff' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="present" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
        </ResponsiveContainer>
    );
};

const leaveData = [
    { name: 'Sick', value: 45, color: '#f59e0b' },
    { name: 'Casual', value: 30, color: '#3b82f6' },
    { name: 'On-Duty', value: 25, color: '#10b981' },
];

export const LeaveDistributionChart = () => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={leaveData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {leaveData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};
