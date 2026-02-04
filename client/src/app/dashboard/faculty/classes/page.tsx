"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import MentorDashboardLayout from "@/components/MentorDashboardLayout";
import HodDashboardLayout from "@/components/HodDashboardLayout";
import { useState, useEffect } from "react";
import { Plus, UserPlus } from "lucide-react";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";

/* OUTER */
export default function FacultyClasses() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FacultyClassesInner />
    </Suspense>
  );
}

/* INNER */
function FacultyClassesInner() {
  const searchParams = useSearchParams();
  const classIdFromUrl = searchParams.get("classId");

  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [userRole, setUserRole] = useState("mentor");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role) setUserRole(user.role);
    fetchClasses();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (classes.length && classIdFromUrl) {
      const target = classes.find(
        (c) => c.id === classIdFromUrl || c._id === classIdFromUrl
      );
      if (target) {
        setSelectedClass(target);
        fetchStudents(target.id || target._id);
      }
    }
  }, [classes, classIdFromUrl]);

  const fetchClasses = async () => {
    const res = await api.get("/users/classes");
    setClasses(res.data);
  };

  const fetchStudents = async (id: string) => {
    const res = await api.get(`/users/class/${id}/students`);
    setStudents(res.data);
  };

  const handleAddClass = async () => {
    await api.post("/users/class", { name: newClassName });
    setNewClassName("");
    setIsAddingClass(false);
    fetchClasses();
  };

  const handleAddStudent = async () => {
    await api.post("/users/student", {
      ...formData,
      password: "password123",
      classId: selectedClass.name,
    });
    setFormData({});
    setIsAddingStudent(false);
    fetchStudents(selectedClass.id);
  };

  const Layout =
    userRole === "hod" ? HodDashboardLayout : MentorDashboardLayout;

  if (loading) return null;

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">My Classes</h2>

      <button onClick={() => setIsAddingClass(!isAddingClass)}>
        <Plus /> Add Class
      </button>

      {isAddingClass && (
        <div>
          <input
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <button onClick={handleAddClass}>Save</button>
        </div>
      )}

      {classes.map((c) => (
        <div key={c.id}>
          <b>{c.name}</b>
          <button
            onClick={() => {
              setSelectedClass(c);
              fetchStudents(c.id);
            }}
          >
            Manage
          </button>
        </div>
      ))}

      {selectedClass && (
        <>
          <h3>Students in {selectedClass.name}</h3>

          <button onClick={() => setIsAddingStudent(!isAddingStudent)}>
            <UserPlus /> Add Student
          </button>

          {isAddingStudent && (
            <div>
              <input
                placeholder="Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <button onClick={handleAddStudent}>Save</button>
            </div>
          )}

          {students.map((s) => (
            <div key={s._id}>{s.name}</div>
          ))}
        </>
      )}
    </Layout>
  );
}
