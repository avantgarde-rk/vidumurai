# Vidumurai - Smart Campus System

Vidumurai is an intelligent leave and attendance management system tailored for educational institutions. It facilitates seamless interaction between Students, Faculty, and HODs.

## 🚀 Quick Start (Windows)

**Option 1: The Easy Way**
1. Double-click the `start.bat` file in this folder.
2. It will open two terminal windows (Server & Client) and launch your browser.

**Option 2: The Manual Way (VS Code)**
1. Open a terminal (`Ctrl` + `~`).
2. Run Server:
   ```bash
   cd server
   npm run dev
   ```
3. Open a second terminal.
4. Run Client:
   ```bash
   cd client
   npm run dev
   ```
5. Open browser: `http://localhost:3000`

---

## 🔑 Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@college.edu` | `password123` |
| **Faculty (Mentor)** | `mentor@college.edu` | `password123` |
| **HOD** | `hod@college.edu` | `password123` |

---

## 🌟 Key Features

### 🎓 Student Portal
- **Dashboard**: View Attendance (Sem & CAT Wise), Pending Leaves.
- **Actions**: Apply for Leave, On-Duty (OD), or Gate Pass.
- **Profile**: Edit personal details and request updates (`/dashboard/student/profile`).
- **Gate Pass**: Request exit passes with QR code generation (`/dashboard/student/gatepass`).
- **On Duty**: Apply for OD, upload brochures, and submit completion certificates (`/dashboard/student/od`).
- **Attendance**: Mark daily attendance.

### 👩‍🏫 Faculty Portal
- **AI-Powered Approvals**: **AI analyzes leave reasons** for tone and urgency to assist decision making.
- **Class Management**: Manage Classes & Student lists.
- **Profile Requests**: Review and Approve/Reject student profile changes (`/dashboard/faculty/profile-requests`).
- **Gate Pass**: Multi-level approval (Mentor -> HOD -> QR Code) (`/dashboard/faculty/gate-pass`).
- **On Duty**: Pre-approve requests and verify uploaded certificates (`/dashboard/faculty/od`).
- **Multi-Level Workflow**: Seamless forwarding of requests to HOD.

### 👔 Admin / HOD Portal
- **Analytics**: View Department-wise Attendance & Leave stats.
- **User Management**: Add/Delete Students & Staff (`/dashboard/admin/users`).
- **Final Approval**: HOD gives the final verdict on leaves.

---

## 💻 Tech Stack & Design
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express, MongoDB.
- **Theme**: **Premium Dark Lavender & White**. A clean, professional aesthetic with glassmorphism effects.
