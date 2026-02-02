'use client';

import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { UserCheck, CheckCircle, XCircle, Users, Search } from 'lucide-react';

export default function FacultyAttendance() {
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch classes first
                const classRes = await api.get('/users/classes');
                setClasses(classRes.data);
                if (classRes.data.length > 0) {
                    setSelectedClass(classRes.data[0].id);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!selectedClass) return;

        const fetchStudents = async () => {
            setLoading(true);
            try {
                // Assuming we have an endpoint for this, or reusing getClassStudents
                // The route is /users/class/:id/students
                const res = await api.get(`/users/class/${selectedClass}/students`);
                setStudents(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [selectedClass]);

    const handleMarkAbsent = async (studentId: string, studentName: string) => {
        if (!confirm(`Mark ${studentName} as ABSENT? This will trigger a WhatsApp Alert to parent.`)) return;

        setMarking(studentId);
        try {
            await api.post('/attendance/absent', {
                studentId,
                date: new Date()
            });
            alert(`${studentName} marked Absent. Parent notified.`);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to mark absent');
        } finally {
            setMarking(null);
        }
    };

    return (
        <MentorDashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <UserCheck className="text-blue-600" /> Attendance Manager
                    </h1>
                    <p className="text-slate-500">Mark daily attendance and notify parents automatically.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Users size={18} className="text-slate-400" />
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.studentCount})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <Search size={16} className="text-slate-400" />
                    <input placeholder="Search student..." className="text-sm outline-none w-full" />
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading students...</div>
                ) : students.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                            <tr>
                                <th className="p-4">Reg No</th>
                                <th className="p-4">Name</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map(student => (
                                <tr key={student._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4 font-mono text-sm text-slate-600">{student.regNo || 'N/A'}</td>
                                    <td className="p-4 font-medium text-slate-800">{student.name}</td>
                                    <td className="p-4 text-center">
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded inline-block">Unmarked</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Mark Present"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleMarkAbsent(student._id, student.name)}
                                                disabled={marking === student._id}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Mark Absent & Notify Parent"
                                            >
                                                {marking === student._id ? (
                                                    <span className="animate-spin block w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full"></span>
                                                ) : (
                                                    <XCircle size={20} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-10 text-center text-slate-400">No students found.</div>
                )}
            </div>
        </MentorDashboardLayout>
    );
}
