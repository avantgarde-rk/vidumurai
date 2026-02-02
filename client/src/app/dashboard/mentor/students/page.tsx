'use client';

import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MyStudents() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Mock student list since we don't have a clean student list endpoint for mentors yet
        // In real app: api.get('/users?role=student&mentor=me')
        setStudents([
            { _id: '1', name: 'John Doe', rollNo: 'CS101', attendance: 85, status: 'Present' },
            { _id: '2', name: 'Jane Smith', rollNo: 'CS102', attendance: 92, status: 'Present' },
            { _id: '3', name: 'Alice Johnson', rollNo: 'CS103', attendance: 74, status: 'Absent' },
            { _id: '4', name: 'Bob Brown', rollNo: 'CS104', attendance: 88, status: 'Present' },
        ] as any);
    }, []);

    return (
        <MentorDashboardLayout>
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">My Mentorship Group</h2>

            <div className="glass-card overflow-hidden bg-white dark:bg-slate-900">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Student Name</th>
                            <th className="p-4 font-semibold text-slate-600">Roll No</th>
                            <th className="p-4 font-semibold text-slate-600">Attendance %</th>
                            <th className="p-4 font-semibold text-slate-600">Today's Status</th>
                            <th className="p-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {students.map((student: any) => (
                            <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 font-medium">{student.name}</td>
                                <td className="p-4 text-slate-500">{student.rollNo}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${student.attendance < 75 ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${student.attendance}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-sm font-semibold ${student.attendance < 75 ? 'text-red-500' : 'text-slate-600'}`}>
                                            {student.attendance}%
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold
                                   ${student.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-blue-600 text-sm hover:underline">View History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MentorDashboardLayout>
    );
}
