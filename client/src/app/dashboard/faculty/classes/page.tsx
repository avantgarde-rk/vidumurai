"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import HodDashboardLayout from '@/components/HodDashboardLayout';
import { useState, useEffect } from 'react';
import { Plus, Trash, UserPlus } from 'lucide-react';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';

/* OUTER COMPONENT */
export default function FacultyClasses() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FacultyClassesInner />
    </Suspense>
  );
}

/* INNER COMPONENT (REAL LOGIC) */
function FacultyClassesInner() {
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

  useEffect(() => {
    if (classes.length > 0 && classIdFromUrl) {
      const targetClass = classes.find(
        c => c.id === classIdFromUrl || c._id === classIdFromUrl
      );
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
    } catch (err) {
      console.error(err);
      setStudents([]);
    }
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
      alert('Please select a class first.');
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
      fetchStudents(selectedClass.id);
      fetchClasses();
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const Layout = userRole === 'hod' ? HodDashboardLayout : MentorDashboardLayout;

  if (loading) return null;

  return (
    <Layout>
      {/* Class Management */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Classes</h2>
          <button
            onClick={() => setIsAddingClass(!isAddingClass)}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            <Plus size={18} /> {isAddingClass ? 'Cancel' : 'Add Class'}
          </button>
        </div>

        {isAddingClass && (
          <div className="mb-6">
            <input
              placeholder="Class Name"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <button onClick={handleAddClass}>Save</button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {classes.map(cls => (
            <div key={cls.id} className="border p-4">
              <h3>{cls.name}</h3>
              <p>{cls.studentCount} Students</p>
              <button onClick={() => {
                setSelectedClass(cls);
                fetchStudents(cls.id);
              }}>
                Manage Students
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Students */}
      <div className="border p-6">
        <h3>
          {selectedClass
            ? `Students in ${selectedClass.name}`
            : 'Select a class'}
        </h3>

        {isAddingStudent && (
          <div>
            <input placeholder="Name"
              onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <input placeholder="Email"
              onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <button onClick={handleAddStudent}>Save Student</button>
          </div>
        )}

        <ul>
          {students.map((s: any) => (
            <li key={s._id}>{s.name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
