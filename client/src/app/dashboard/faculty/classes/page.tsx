'use client';

import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import HodDashboardLayout from '@/components/HodDashboardLayout';
import { useState, useEffect } from 'react';
import { Plus, Trash, UserPlus, Edit2 } from 'lucide-react';
import api from '@/lib/api';

import { useSearchParams } from 'next/navigation';

export default function FacultyClasses() {
    const searchParams = useSearchParams();
    const classIdFromUrl = searchParams.get('classId');

    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [isAddingClass, setIsAddingClass] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [userRole, setUserRole] = useState('mentor');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role) setUserRole(user.role);
        fetchClasses();
        setLoading(false);
    }, []);

    // Auto-select class from URL
    useEffect(() => {
        if (classes.length > 0 && classIdFromUrl) {
            const targetClass = classes.find(c => c.id === classIdFromUrl || c._id === classIdFromUrl);
            if (targetClass) {
                setSelectedClass(targetClass);
                fetchStudents(targetClass.id || targetClass._id);
            }
        }
    }, [classes, classIdFromUrl]);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/users/classes');
            setClasses(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchStudents = async (classId: string) => {
        try {
            const res = await api.get(`/users/class/${classId}/students`);
            setStudents(res.data);
        } catch (err) { console.error(err); setStudents([]); }
    };

    const handleAddClass = async () => {
        try {
            await api.post('/users/class', { name: newClassName });
            alert('Class added!');
            setIsAddingClass(false);
            setNewClassName('');
            fetchClasses();
        } catch (err: any) {
            alert('Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleAddStudent = async () => {
        if (!selectedClass) {
            alert('Please select a class first (click Manage Students on a class card).');
            return;
        }
        try {
            await api.post('/users/student', {
                ...formData,
                password: 'password123',
                classId: selectedClass.name
            });
            alert('Student added successfully!');
            setIsAddingStudent(false);
            setFormData({});
            fetchStudents(selectedClass.id); // Refresh student list
            fetchClasses(); // Update counts
        } catch (err: any) {
            alert('Failed to add student: ' + (err.response?.data?.message || err.message));
        }
    };

    const Layout = userRole === 'hod' ? HodDashboardLayout : MentorDashboardLayout;

    if (loading) return null; // Prevent hydration mismatch or flash

    return (
        <Layout>

            {/* Class Management Section */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">My Classes</h2>
                    <button
                        onClick={() => setIsAddingClass(!isAddingClass)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition shadow-lg shadow-purple-200">
                        <Plus size={18} /> {isAddingClass ? 'Cancel' : 'Add Class'}
                    </button>
                </div>

                {isAddingClass && (
                    <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100 flex gap-4 items-center animate-fade-in">
                        <input
                            placeholder="Class Name (e.g. IV-CSE-A)"
                            className="p-2 rounded border border-purple-200 outline-none focus:ring-2 focus:ring-purple-500/20 w-64"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                        />
                        <button onClick={handleAddClass} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700">Save</button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {classes.map(cls => (
                        <div key={cls.id} className="glass-card p-6 bg-white flex flex-col justify-between h-32 relative group border border-slate-100 hover:border-purple-200">
                            <div>
                                <h3 className="text-xl font-bold text-slate-700">{cls.name}</h3>
                                <p className="text-slate-500 text-sm">{cls.studentCount} Students</p>
                            </div>
                            <button className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash size={18} />
                            </button>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedClass(cls);
                                        fetchStudents(cls.id);
                                    }}
                                    className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-semibold hover:bg-purple-100 transition-colors">
                                    Manage Students
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Student Management Interface */}
            <div className="glass-card p-6 bg-white border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">
                        {selectedClass ? `Students in ${selectedClass.name}` : 'Select a Class to Manage'}
                    </h3>
                    {selectedClass && (
                        <button
                            onClick={() => setIsAddingStudent(!isAddingStudent)}
                            className="bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition"
                        >
                            <UserPlus size={18} /> {isAddingStudent ? 'Cancel' : 'Add Student'}
                        </button>
                    )}
                </div>

                {isAddingStudent && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
                        <h4 className="font-bold text-slate-700 mb-4">New Student Details</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input placeholder="Name" className="p-2 rounded border" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <input placeholder="Email" className="p-2 rounded border" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            <input placeholder="Reg No" className="p-2 rounded border" onChange={e => setFormData({ ...formData, regNo: e.target.value })} />
                            <input placeholder="Department" className="p-2 rounded border" onChange={e => setFormData({ ...formData, department: e.target.value })} />
                        </div>
                        <button onClick={handleAddStudent} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition">Save Student</button>
                    </div>
                )}

                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-purple-100 bg-purple-50/50 text-purple-700">
                            <th className="p-3 pl-4 rounded-tl-lg font-semibold">Reg No</th>
                            <th className="p-3 font-semibold">Name</th>
                            <th className="p-3 rounded-tr-lg font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? students.map((s: any) => (
                            <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => alert(`Student: ${s.name}\nEmail: ${s.email}\nPhone: ${s.phone || 'N/A'}`)}>
                                <td className="p-4 font-mono text-slate-600">{s.regNo || 'N/A'}</td>
                                <td className="p-4 font-bold text-slate-700 group-hover:text-purple-600 transition-colors">{s.name}</td>
                                <td className="p-4 text-xs text-slate-400">Click to View</td>
                            </tr>
                        )) : (
                            <tr className="border-b border-slate-50 text-slate-400 text-center italic">
                                <td colSpan={3} className="p-8">
                                    {selectedClass ? 'No students found in this class.' : 'Select a class to view/manage students.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </Layout>
    );
}
