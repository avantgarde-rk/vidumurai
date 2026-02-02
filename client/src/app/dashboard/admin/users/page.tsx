'use client';

import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import { useState, useEffect } from 'react';
import { Trash, Edit, Plus, Search } from 'lucide-react';
// import api from '@/lib/api'; // In real app, use API to fetch users

export default function ManageUsers() {
    // Mock Data
    const [users, setUsers] = useState([
        { id: '1', name: 'Arun Vijay', email: 'student@college.edu', role: 'student', dept: 'CSE' },
        { id: '2', name: 'Prof. Senthil', email: 'mentor@college.edu', role: 'mentor', dept: 'CSE' },
        { id: '3', name: 'Dr. Kavitha', email: 'hod@college.edu', role: 'hod', dept: 'CSE' },
    ]);
    const [filter, setFilter] = useState('');

    const handleDelete = (id: string) => {
        if (confirm('Delete User?')) {
            setUsers(users.filter(u => u.id !== id));
            // api.delete(`/users/${id}`)
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(filter.toLowerCase()) ||
        u.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <AdminDashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <Plus size={18} /> Add User
                </button>
            </div>

            <div className="glass-card bg-white p-6 mb-6">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-500 text-sm">
                                <th className="p-4">Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Department</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{user.name}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${user.role === 'student' ? 'bg-blue-100 text-blue-700' :
                                                user.role === 'mentor' ? 'bg-green-100 text-green-700' :
                                                    'bg-purple-100 text-purple-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600">{user.dept}</td>
                                    <td className="p-4 flex gap-3">
                                        <button className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
